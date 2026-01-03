import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const users = await db.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const usersComRoles = users.map(user => ({
      ...user,
      roles: user.userRoles.map(ur => ({
        id: ur.role.id,
        nome: ur.role.nome,
        descricao: ur.role.descricao,
      })),
      userRoles: undefined,
    }))

    return NextResponse.json(usersComRoles)
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error)
    return NextResponse.json(
      { error: 'Erro ao listar utilizadores' },
      { status: 500 }
    )
  }
}
