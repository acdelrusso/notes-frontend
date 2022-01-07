import React from 'react'

function LoginForm({handleLogin, username, setUsername, password, setPassword}) {
    return (
        <form onSubmit={handleLogin}>
      <div>
          username
          <input type="text"
            value={username}
            onChange={({target}) => setUsername(target.value)}
            name='username'
           />
      </div>
      <div>
          password
          <input type="password" 
            value={password}
            onChange={({target}) => setPassword(target.value)}
            name='password'
          />
      </div>
        <button type='submit'>login</button>
      </form>
    )
}

export default LoginForm
