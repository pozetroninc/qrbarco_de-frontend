import { shallowMount } from '@vue/test-utils'
import AppForm from '@/components/Form.vue'

jest.mock('@/../app.sass.config.json', () => ({
  COLOR_SCHEMES: {
    'test-color-scheme': {
      'primary': { r: 54, g: 50, b: 55 },
      'secondary-1': { r: 45, g: 66, b: 98 },
      'secondary-2': { r: 115, g: 96, b: 91 },
      'secondary-3': { r: 208, g: 150, b: 131 }
    }
  }
}))

describe('Form.vue', () => {
  const SOME_PAYLOAD = 'some payload'
  const SOME_INPUT = 'x'
  const SOME_COLOR_SCHEME_NAME = 'test-color-scheme'
  const SOME_METHOD_NAME = 'text'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppForm, {
      propsData: {
        payload: SOME_PAYLOAD,
        activeColorScheme: SOME_COLOR_SCHEME_NAME,
        activeMethod: SOME_METHOD_NAME,
        handleSubmit: () => { },
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
      expect(wrapper.vm.$emit).toBeCalledWith('payload-input', expect.objectContaining({ 'target': expect.objectContaining({ 'value': expect.stringContaining(SOME_INPUT) }) }))

      spy.mockReset()
    })
    // TODO: test submit and other behaviour
  })
})
