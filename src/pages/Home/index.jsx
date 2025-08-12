import { useEffect, useState, useRef } from 'react'
import IconDelete from '../../assets/img/icon-delete.png'
import IconEdit from '../../assets/img/icon-edit.png'
import './style.css'
import api from '../../services/api'

function Home() {
  const [users, setUsers] = useState([])
  const [editUserId, setEditUserId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const inputName = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')
    setUsers(usersFromApi.data)
  }

  async function createUser() {
    await api.post('/usuarios', {
      name: inputName.current.value,
      email: inputEmail.current.value
    })
    clearForm()
    getUsers()
  }

  async function updateUser() {
    await api.put(`/usuarios/${editUserId}`, {
      name: inputName.current.value,
      email: inputEmail.current.value
    })
    clearForm()
    setEditUserId(null)
    getUsers()
  }

  async function confirmDelete() {
    if (userToDelete) {
      await api.delete(`/usuarios/${userToDelete}`)
      setShowModal(false)
      setUserToDelete(null)
      getUsers()
    }
  }

  function handleDeleteClick(id) {
    setUserToDelete(id)
    setShowModal(true)
  }

  function editUser(user) {
    setEditUserId(user.id)
    inputName.current.value = user.name
    inputEmail.current.value = user.email
  }

  function clearForm() {
    inputName.current.value = ''
    inputEmail.current.value = ''
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='container'>
      <form className='form'>
        <h1 className='title'>
          {editUserId ? 'Editar Usuário' : 'Cadastro de Usuários'}
        </h1>
        <input
          placeholder="Digite seu Nome"
          type="text"
          name="nome"
          ref={inputName}
        />
        <input
          placeholder="Digite seu e-mail"
          type="email"
          name="email"
          ref={inputEmail}
        />
        {editUserId ? (
          <button
            type="button"
            className='btn'
            onClick={updateUser}
          >
            Salvar Alterações
          </button>
        ) : (
          <button
            type="button"
            className='btn'
            onClick={createUser}
          >
            Cadastrar
          </button>
        )}
      </form>

      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>e-mail: <span>{user.email}</span></p>
          </div>
          <div className='btn-actions'>
            <button
              onClick={() => editUser(user)}
              className='btn-edit'
            >
              <img
                src={IconEdit}
                alt="Edit Icon"
                width={30}
                height={30}
              />
            </button>
            <button
              onClick={() => handleDeleteClick(user.id)}
              className='btn-delete'
            >
              <img
                src={IconDelete}
                alt="Delete Icon"
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tem certeza que deseja apagar o usuário?</h2>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={confirmDelete}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
