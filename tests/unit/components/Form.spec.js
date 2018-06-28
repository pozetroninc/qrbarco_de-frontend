import { shallowMount } from '@vue/test-utils'
import AppForm from '@/components/Form.vue'

describe('Form.vue', () => {
  const SOME_PAYLOAD = 'some payload'
  const SOME_INPUT = 'x'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppForm, {
      propsData: {
        payload: SOME_PAYLOAD,
        activeColorScheme: 'dusk', // TODO: do not rely on user-provided configs, monkey-patch them instead.
        activeMethod: 'text',
        handleSubmit: () => {},
        loading: false,
        disabled: false
      }
    })
  })

  describe('Properties', () => {
    // TODO: test props
  })

  describe('Behaviour', () => {
    it('emits a "payload-input" event when textarea edited', () => {
      const spy = jest.spyOn(wrapper.vm, '$emit')

      const textarea = wrapper.find('textarea')
      textarea.element.value = SOME_INPUT
      textarea.trigger('input')
      expect(wrapper.vm.$emit).toBeCalledWith('payload-input', expect.objectContaining({'target': expect.objectContaining({'value': expect.stringContaining(SOME_INPUT)})}))

      spy.mockReset()
    })
    // TODO: test submit and other behaviour
  })
})
