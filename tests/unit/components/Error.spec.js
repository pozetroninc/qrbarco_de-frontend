import {describe, it, expect, beforeEach} from 'vitest'
import {shallowMount} from '@vue/test-utils'
import AppError from '@/components/Error.vue'

describe('Error.vue', () => {
  const SOME_ERROR_TEXT = 'some error'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppError, {
      props: {error: SOME_ERROR_TEXT}
    })
  })

  describe('Properties', () => {
    it('has a required error string prop', () => {
      const errorProp = wrapper.vm.$options.props.error
      expect(errorProp.type).toBe(String)
      expect(errorProp.required).toBeTruthy()
    })
  })

  describe('Behaviour', () => {
    it('renders props.error when passed', () => {
      expect(wrapper.text()).toMatch(SOME_ERROR_TEXT)
    })
    it('emits a "close" event when close button clicked', async () => {
      await wrapper.find('.delete').trigger('click')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })
})
