import { shallowMount } from '@vue/test-utils'
import AppResult from '@/components/Result.vue'

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

describe('Result.vue', () => {
  const SOME_COLOR_SCHEME_NAME = 'test-color-scheme'
  const SOME_BASE64_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACEAQAAAAB5P74KAAAAz0lEQVR4nO2VUQ6DMAxDfQPf/5a5QWaHTlr3R83fVhCqHlJEbDegv1bhT3YCgKwivQkIdVPb2SREhf24NhlBCTxAiEanxNAObL3fJ6O81+7FbTL+y0Nu2Tgg8k5B0GXdAmK5TFgdEYey1KReJARVjcvJTohFL07ZiEivdvGazzwnTjYEIdkSYgPlnoVfSTgjUmxVJhmQvsLQtjAhc0A8APhO5hlZxs0sichMNh9ca5YR9ahTh5goUCMbEzKd9uSyA7IGmrLATy9uk7O/54+QF75UvDA1XU46AAAAAElFTkSuQmCC'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppResult, {
      propsData: {
        result: SOME_BASE64_IMG,
        activeColorScheme: SOME_COLOR_SCHEME_NAME
      }
    })
  })

  describe('Properties', () => {
    it('has a required result string prop', () => {
      expect(wrapper.vm.$options.props.result.type).toBe(String)
      expect(wrapper.vm.$options.props.result.required).toBeTruthy()
    })
  })

  describe('Behaviour', () => {
    it('renders props.result image when passed', () => {
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes().src).toBe(SOME_BASE64_IMG)
    })
  })
})
