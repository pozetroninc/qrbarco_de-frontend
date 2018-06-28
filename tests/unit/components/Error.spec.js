import { shallowMount } from '@vue/test-utils'
import AppError from '@/components/Error.vue'

describe('Error.vue', () => {
  const SOME_ERROR_TEXT = 'some error'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppError, {
      propsData: { error: SOME_ERROR_TEXT }
    })
  })

  describe('Properties', () => {
    it('has a required error string prop', () => {
      expect(wrapper.vm.$options.props.error.type).toBe(String)
      expect(wrapper.vm.$options.props.error.required).toBeTruthy()
    })
  })

  describe('Behaviour', () => {
    it('renders props.error when passed', () => {
      expect(wrapper.text()).toMatch(SOME_ERROR_TEXT)
    })
    it('emits a "close" event when close button clicked', () => {
      const spy = jest.spyOn(wrapper.vm, '$emit')

      wrapper.find('.delete').trigger('click')
      expect(wrapper.vm.$emit).toBeCalledWith('close')
      spy.mockReset()
    })
  })
})
