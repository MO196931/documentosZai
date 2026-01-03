import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, roleId } = body

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: 'ID do utilizador e ID do papel são obrigatórios' },
        { status: 400 }
      )
    }

    const userRole = await db.userRole.create({
      data: {
        userId,
        roleId,
      },
      include: {
        role: true,
        user: true,
      },
    })

    return NextResponse.json(userRole)
  } catch (error) {
    console.error('Erro ao atribuir papel:', error)
    return NextResponse.json(
      { error: 'Erro ao atribuir papel ao utilizador' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const roleId = searchParams.get('roleId')

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: 'ID do utilizador e ID do papel são obrigatórios' },
        { status: 400 }
      )
    }

    await db.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover papel:', error)
    return NextResponse.json(
      { error: 'Erro ao remover papel do utilizador' },
      { status: 500 }
    )
  }
}
