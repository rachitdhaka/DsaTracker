import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Test: Todos</h1>
      {todos && todos.length > 0 ? (
        <ul className="list-disc pl-5">
          {todos.map((todo) => (
            <li key={todo.id} className="mb-2">
              {todo.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-zinc-500">
          No todos found. If you just created the project, make sure to create a 'todos' table with a 'name' column.
        </p>
      )}
    </div>
  )
}
