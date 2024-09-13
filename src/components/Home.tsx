import { useState, useEffect, ChangeEvent } from 'react'
import { Baby, Cake, Edit, Trash2, User } from "lucide-react"

interface Inaanak {
  name: string
  age: string
  gender: string
  birthday: string
  father: string
  mother: string
  christening: string
}

interface FormState {
  name: string
  age: string
  gender: string
  birthday: string
  father: string
  mother: string
  christening: string
}

export const HomePage = () => {
  const [inaanaks, setInaanaks] = useState<Inaanak[]>([])
  const [form, setForm] = useState<FormState>({
    name: '',
    age: '',
    gender: '',
    birthday: '',
    father: '',
    mother: '',
    christening: ''
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isLoaded, setIsLoaded] = useState(false)
  const [inaanakToDelete, setInaanakToDelete] = useState<number | null>(null)

  useEffect(() => {
    const storedGodChilds = JSON.parse(localStorage.getItem('inaanaks') || '[]')
    setInaanaks(storedGodChilds)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('inaanaks', JSON.stringify(inaanaks))
    }
  }, [inaanaks, isLoaded])

  const calculateAge = (birthday: Date) => {
    const birthDate = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target

    if (name === 'birthday') {
      const age = calculateAge(value as unknown as Date)
      setForm({ ...form, [name]: value, age: age.toString() })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    e.preventDefault()

    if (editingIndex !== null) {
      const updatedInaanaks = [...inaanaks]
      updatedInaanaks[editingIndex] = form
      setInaanaks(updatedInaanaks)
      setEditingIndex(null)
    } else {
      setInaanaks([...inaanaks, form])
    }
    handleReset()
    setIsModalOpen(false)
  }

  const handleReset = () => {
    setForm({
      name: '',
      age: '',
      gender: '',
      birthday: '',
      father: '',
      mother: '',
      christening: ''
    })
  }

  const handleEdit = (index: number) => {
    setForm(inaanaks[index])
    setEditingIndex(index)
    setIsModalOpen(true)
  }

  const handleDelete = (index: number) => {
    const updatedInaanaks = inaanaks.filter((_, i) => i !== index)
    setInaanaks(updatedInaanaks)
    setInaanakToDelete(null)
  }

  const filteredGodChilds = inaanaks.filter(inaanak =>
    inaanak.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastGodChild = currentPage * itemsPerPage
  const indexOfFirstGodChild = indexOfLastGodChild - itemsPerPage
  const currentGodChild = filteredGodChilds.slice(indexOfFirstGodChild, indexOfLastGodChild)

  const formatDate = (date: Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return dateObj.toLocaleDateString('en-US', options);
  }
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Inaanak Management</h1>
          <p className="text-indigo-600">Iregister na dito, masiyado nang madami eh! </p>
        </header>

        <p className="text-indigo-600"><small>
          Inaanak na naman?</small></p>
        <button
          onClick={() => {
            setEditingIndex(null)
            setIsModalOpen(true)
            handleReset()
          }}
          className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center"
        >
          <User className="mr-2 h-4 w-4" />Add mo na nga!
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl text-indigo-500 font-semibold mb-4">{editingIndex !== null ? 'Mag-edit' : 'Magdagdag'} ng Inaanak</h2>
              {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Pangalan</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-500 shadow-md focus:border-indigo-300 focus:ring text-gray-800 p-2 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Kasarian</label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-500 shadow-md focus:border-indigo-300 focus:ring text-gray-800 p-2 focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Lalaki</option>
                    <option value="Female">Babae</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Kaarawan</label>
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={form.birthday}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-500 shadow-md focus:border-indigo-300 focus:ring text-gray-800 p-2 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">Edad</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-500 shadow-md focus:border-indigo-300 focus:ring text-gray-800 p-2 focus:ring-indigo-200 focus:ring-opacity-50"
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="father" className="block text-sm font-medium text-gray-700">Tatay (Hindi naman required si kumpare)</label>
                  <input
                    id="father"
                    name="father"
                    type="text"
                    value={form.father}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-500 shadow-md focus:border-indigo-300 focus:ring text-gray-800 p-2 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="mother" className="block text-sm font-medium text-gray-700">Nanay (Hindi naman required si kumare)</label>
                  <input
                    id="mother"
                    name="mother"
                    type="text"
                    value={form.mother}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-500 shadow-md focus:border-indigo-300 focus:ring text-gray-800 p-2 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="christening" className="block text-sm font-medium text-gray-700">Kelan Binyag nito?</label>
                  <input
                    id="christening"
                    name="christening"
                    type="date"
                    value={form.christening}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-500 shadow-md focus:border-indigo-300 focus:ring text-gray-800 p-2 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Huwag nalang
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {editingIndex !== null ? 'Iedit' : 'Idagdag'} ang inaanak.
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search natin yan gamit ang pangalan ng inaanak mo kung sayo talaga yan haha"
            className="p-2 border text-gray-700 border-gray-300 rounded-md mr-4 w-full"
          />
        </div>

        <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Mga Inaanak</h2>

        <ul className="space-y-4">
          {currentGodChild.length > 0 ? (
            currentGodChild.map((inaanak, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-600">{inaanak.name}</h3>
                    <p className="text-gray-600 flex flex-row"><Cake className="inline-block h-5 w-5 mr-1" />
                      <span className='my-auto'>
                        Edad: {inaanak.age} | Birthday: {formatDate(inaanak.birthday as unknown as Date)}
                      </span>
                    </p>
                    <p className="text-gray-600 flex flex-row">
                      <Baby className="inline-block h-5 w-5 mr-1" />
                      <span className='my-auto'>
                        Araw ng Binyag: {formatDate(inaanak.christening as unknown as Date)}
                      </span>
                    </p>
                    <p className="text-gray-600">Kasarian: {inaanak.gender}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setInaanakToDelete(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : searchTerm !== '' ? (
            <li className="bg-white p-4 rounded-lg shadow-md text-center text-gray-700">Walang nakitang inaanak. Di mo inaanak yan! Hahaha</li>
          ) :
            (
              <li className="bg-white p-4 rounded-lg shadow-md text-center text-gray-700">Ayos ahh! Wala ka pang inaanak!</li>

            )
          }
        </ul>

        {typeof inaanakToDelete === 'number' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-red-600 text-center mb-4">
                Ayaw mo na sa inaanak mong to?
              </h2>
              <div className='flex flex-row gap-2 justify-center'>
                <button
                  type="button"
                  onClick={() => setInaanakToDelete(null)}
                  className="px-4 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ay joke lang pala.
                </button>
                <button
                  onClick={() => handleDelete(inaanakToDelete)}
                  className="text-red-600 hover:text-red-800 border border-red-500 rounded-md flex flex-row p-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Oo, tanggalin na to.
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={currentPage === 1}
          >
            Mga Nakalipas
          </button>
          <span className="text-gray-700">
            Pahina {currentPage} of {Math.ceil(filteredGodChilds.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredGodChilds.length / itemsPerPage)))}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={currentPage === Math.ceil(filteredGodChilds.length / itemsPerPage)}
          >
            Mga Iba Pa
          </button>
        </div>
      </div>
    </div>
  )
}
