import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do ativo não fornecido' },
        { status: 400 }
      )
    }

    await db.ativo.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir ativo:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir ativo' },
      { status: 500 }
    )
  }
}
