import {describe, it, expect, beforeEach} from 'vitest'
import {shallowMount} from '@vue/test-utils'
import AppForm from '@/components/Form.vue'

describe('Form.vue', () => {
  const SOME_PAYLOAD = 'some payload'
  const SOME_INPUT = 'x'
  const SOME_METHOD_NAME = 'text'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppForm, {
      props: {
        payload: SOME_PAYLOAD,
        activeMethod: SOME_METHOD_NAME,
        loading: false,
        disabled: false
      }
    })
  })

  describe('Behaviour', () => {
    it('emits a "payload-input" event when textarea edited', async () => {
      const textarea = wrapper.find('textarea')
      textarea.element.value = SOME_INPUT
      await textarea.trigger('input')
      expect(wrapper.emitted('payload-input')).toHaveLength(1)
      const event = wrapper.emitted('payload-input')[0][0]
      expect(event.target.value).toContain(SOME_INPUT)
    })
  })
})
