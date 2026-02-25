import {describe, it, expect, beforeEach} from 'vitest'
import {shallowMount} from '@vue/test-utils'
import AppResult from '@/components/Result.vue'

describe('Result.vue', () => {
  const SOME_BASE64_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACEAQAAAAB5P74KAAAAz0lEQVR4nO2VUQ6DMAxDfQPf/5a5QWaHTlr3R83fVhCqHlJEbDegv1bhT3YCgKwivQkIdVPb2SREhf24NhlBCTxAiEanxNAObL3fJ6O81+7FbTL+y0Nu2Tgg8k5B0GXdAmK5TFgdEYey1KReJARVjcvJTohFL07ZiEivdvGazzwnTjYEIdkSYgPlnoVfSTgjUmxVJhmQvsLQtjAhc0A8APhO5hlZxs0sichMNh9ca5YR9ahTh5goUCMbEzKd9uSyA7IGmrLATy9uk7O/54+QF75UvDA1XU46AAAAAElFTkSuQmCC'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppResult, {
      props: {
        result: SOME_BASE64_IMG
      }
    })
  })

  describe('Properties', () => {
    it('has a required result string prop', () => {
      const resultProp = wrapper.vm.$options.props.result
      expect(resultProp.type).toBe(String)
      expect(resultProp.required).toBeTruthy()
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
