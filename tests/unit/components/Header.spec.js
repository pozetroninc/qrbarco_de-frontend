import { shallowMount } from '@vue/test-utils'
import AppHeader from '@/components/Header.vue'

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

describe('Header.vue', () => {
  const SOME_COLOR_SCHEME_NAME = 'test-color-scheme'
  const SOME_METHOD_NAME = 'base64'
  const SOME_METHOD_CHANGE_HANDLER = (method) => method

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppHeader, {
      propsData: {
        activeColorScheme: SOME_COLOR_SCHEME_NAME,
        activeMethod: SOME_METHOD_NAME,
        handleMethodChange: SOME_METHOD_CHANGE_HANDLER
      }
    })
  })

  describe('Properties', () => {
    it('has a required activeMethod string prop', () => {
      expect(wrapper.vm.$options.props.activeMethod.type).toBe(String)
      expect(wrapper.vm.$options.props.activeMethod.required).toBeTruthy()
    })
    it('has a required handleMethodChange function prop', () => {
      expect(wrapper.vm.$options.props.handleMethodChange.type).toBe(Function)
      expect(wrapper.vm.$options.props.handleMethodChange.required).toBeTruthy()
    })
  })

  describe('Behaviour', () => {
    it('activates the props.activeMethod tab', () => {
      expect(wrapper.find(`li.${SOME_METHOD_NAME}`).classes()).toContain('is-active')
    })
    it('has only one tab active at a time', () => {
      expect(wrapper.findAll('li.is-active')).toHaveLength(1)
    })
  })
})
