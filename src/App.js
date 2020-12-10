import { useEffect, useState } from 'react'

function App() {
  const [name, setName] = useState({
    first_name: '',
    last_name: '',
  })
  const client_id = 7694787
  const redirect_uri = 'http://localhost:3000'
  const version = '5.52'
  const auth_url = `https://oauth.vk.com/authorize?client_id=${client_id}&display=page&redirect_uri=${redirect_uri}&scope=friends&response_type=token&v=${version}`

  useEffect(() => {
    let params = {};
    if (window.location.hash) {
      const access_token = window.location.hash.match(/access_token=([^&=]+)/)
      const user_id = window.location.hash.match(/user_id=([^&=]+)/)
      params = {
        access_token: access_token && access_token[1],
        user_id: user_id && user_id[1]
      };
    }
    if (!params.access_token) {
      window.location.replace(auth_url)
    } else {
      fetch(`https://api.vk.com/method/users.get?user_ids=${params.user_id}&access_token=${params.access_token}&v=${version}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }).then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('response fail')
        }
      }).then(data => {
        const { first_name, last_name } = data.response[0]
        setName({
          first_name,
          last_name
        })
      }).catch(error => {
        console.error(error)
      })
    }
  }, [])

  return (
    <h1>
      {name.first_name} {name.last_name}
    </h1>
  );
}

export default App;
