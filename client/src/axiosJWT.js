import axios from 'axios'

let refreshPending = false 

const makeRefreshRequest = async () => {
  try {
    refreshPending = true
    const res = await axios.post('/auth/refresh')

    localStorage.setItem(
      'access_token_expiration_time',
      res.data.expirationTime
    )
    refreshPending = false
  } catch (err) {
    refreshPending = false
    console.log('Refresh error')
  }
}

export const axiosJWT = () => {
  const axiosInstace = axios.create()

  axiosInstace.interceptors.request.use(
    async (config) => {
      if (!refreshPending) {
        ////
        const currentDate = new Date()
        const accessTokenExp = localStorage.getItem(
          'access_token_expiration_time'
        )

        if (accessTokenExp) {
          if (accessTokenExp * 1000 - 60000 < currentDate.getTime()) {
            await makeRefreshRequest()
          }
        } else {
          await makeRefreshRequest()
        }
      }

      return config
    },
    (err) => {
      console.log(err)
      return Promise.reject(err)
    }
  )

  axiosInstace.interceptors.response.use(
    async (response) => {
      return response
    },
    (err) => {
      if (err.response.status === 401) {
        return axios.request(err.config)
      } else return Promise.reject()
    }
  )
  return axiosInstace
}
