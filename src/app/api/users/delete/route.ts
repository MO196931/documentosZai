import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do utilizador não fornecido' },
        { status: 400 }
      )
    }

    await db.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar utilizador:', error)
    return NextResponse.json(
      { error: 'Erro ao eliminar utilizador' },
      { status: 500 }
    )
  }
}
