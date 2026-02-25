import {describe, it, expect, beforeEach} from 'vitest'
import {shallowMount} from '@vue/test-utils'
import AppHeader from '@/components/Header.vue'

describe('Header.vue', () => {
  const SOME_METHOD_NAME = 'base64'

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AppHeader, {
      props: {
        activeMethod: SOME_METHOD_NAME
      }
    })
  })

  describe('Properties', () => {
    it('has a required activeMethod string prop', () => {
      const activeMethodProp = wrapper.vm.$options.props.activeMethod
      expect(activeMethodProp.type).toBe(String)
      expect(activeMethodProp.required).toBeTruthy()
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
