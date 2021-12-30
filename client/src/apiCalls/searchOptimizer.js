import axios from 'axios'

import { axiosJWT } from '../axiosJWT'

const previousRequests = {}

const makeRequestCreator = () => {
  let source
  return async (query) => {
    if (source) {
      source.cancel()
    }
    source = axios.CancelToken.source()

    try {
      if (previousRequests[query]) return previousRequests[query]

      const res = await axiosJWT().get(query, { cancelToken: source.token })

      previousRequests[query] = res.data

      return res.data
    } catch (err) {
      if (axios.isCancel(err)) console.log('Request caneled')
    }
  }
}
export const search = makeRequestCreator()
