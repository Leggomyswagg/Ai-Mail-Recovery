import { test } from 'node:test'
import assert from 'node:assert/strict'
import handler, { generateRecoveryPlan } from '../api/recovery-plan.js'
import { getFallbackSteps, parseRecoverySteps, validateRequest, PROVIDERS, PROBLEMS } from '../src/lib/recovery.js'

const input = { provider: 'Gmail', problem: 'forgot_password', details: '' }
test('every provider and problem produces a nonempty guide', () => {
  for (const provider of PROVIDERS) for (const problem of PROBLEMS) {
    const steps = getFallbackSteps(provider, problem)
    assert.ok(steps.length >= 6)
    assert.ok(steps.every(step => typeof step === 'string' && step.length > 0))
  }
  assert.notDeepEqual(getFallbackSteps('Gmail', 'forgot_password'), getFallbackSteps('Gmail', 'lost_2fa'))
})
test('request validation bounds provider, problem, and details and excludes email', () => {
  assert.deepEqual(validateRequest({ ...input, email: 'private@example.test' }), input)
  for (const data of [null, [], {}, { ...input, provider: 'unknown' }, { ...input, problem: 'unknown' }, { ...input, details: {} }, { ...input, details: 'x'.repeat(1001) }]) {
    assert.throws(() => validateRequest(data))
  }
})
test('missing key uses curated guidance without making an upstream request', async () => {
  const result = await generateRecoveryPlan(input, { apiKey: '', fetchImpl: () => { throw new Error('Must not call upstream') } })
  assert.equal(result.source, 'guide')
  assert.deepEqual(result.steps, getFallbackSteps('Gmail', 'forgot_password'))
})
test('server sends its key to the AI but never sends an email address', async () => {
  let called = false
  const result = await generateRecoveryPlan({ ...input, email: 'private@example.test' }, {
    apiKey: 'server-test-key',
    fetchImpl: async (url, options) => {
      called = true
      assert.equal(url, 'https://api.anthropic.com/v1/messages')
      assert.equal(options.headers['x-api-key'], 'server-test-key')
      assert.ok(options.signal instanceof AbortSignal)
      assert.ok(!options.body.includes('private@example.test'))
      return { ok: true, json: async () => ({ content: [{ type: 'text', text: '["Visit official recovery", "Follow verification", "Review account security"]' }] }) }
    },
  })
  assert.equal(called, true)
  assert.equal(result.source, 'ai')
  assert.equal(result.steps.length, 3)
  assert.ok(!JSON.stringify(result).includes('server-test-key'))
})
test('API failures and malformed model output fall back to useful guidance', async () => {
  for (const fetchImpl of [async () => { throw new Error('timeout') }, async () => ({ ok: false }), async () => ({ ok: true, json: async () => ({ content: [{ type: 'text', text: 'no usable checklist' }] }) })]) {
    const result = await generateRecoveryPlan(input, { apiKey: 'test', fetchImpl })
    assert.equal(result.source, 'guide')
    assert.ok(result.steps.length >= 6)
  }
})
test('parser accepts JSON/code fences/numbered lists and rejects empty or oversized output', () => {
  assert.deepEqual(parseRecoverySteps('```json\n["One", "Two", "Three"]\n```'), ['One', 'Two', 'Three'])
  assert.deepEqual(parseRecoverySteps('1. One\n2) Two\n3. Three'), ['One', 'Two', 'Three'])
  for (const text of ['', '[]', '{}', '[null, 2, 3]', '["one"]', JSON.stringify(['x'.repeat(601), 'Two', 'Three'])]) assert.throws(() => parseRecoverySteps(text))
})

function response() {
  return { headers: {}, code: 0, data: null, setHeader(key, value) { this.headers[key] = value }, status(code) { this.code = code; return this }, json(data) { this.data = data; return this } }
}
test('HTTP handler rejects unsupported methods and invalid requests without exposing secrets', async () => {
  const method = response()
  await handler({ method: 'GET' }, method)
  assert.equal(method.code, 405)
  assert.equal(method.headers.Allow, 'POST')
  const bad = response()
  await handler({ method: 'POST', body: {} }, bad)
  assert.equal(bad.code, 400)
  assert.equal(bad.headers['Cache-Control'], 'no-store')
})
test('repeated requests are limited on one server instance', async () => {
  let last
  for (let i = 0; i < 11; i++) {
    last = response()
    await handler({ method: 'POST', body: input, socket: { remoteAddress: 'test-client' } }, last)
  }
  assert.equal(last.code, 429)
})
