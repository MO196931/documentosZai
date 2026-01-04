import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const roles = await db.role.findMany({
      include: {
        userRoles: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const rolesComContagem = roles.map(role => ({
      ...role,
      userRoles: role.userRoles.length,
    }))

    return NextResponse.json(rolesComContagem)
  } catch (error) {
    console.error('Erro ao listar papéis:', error)
    return NextResponse.json(
      { error: 'Erro ao listar papéis' },
      { status: 500 }
    )
  }
}
