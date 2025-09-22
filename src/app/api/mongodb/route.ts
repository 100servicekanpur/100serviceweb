import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb-connection'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const { operation, args } = await request.json()
    const { db } = await connectToDatabase()
    
    switch (operation) {
      case 'find': {
        const [database, collection, filter = {}, options = {}] = args
        const coll = db.collection(collection)
        const documents = await coll.find(filter, options).toArray()
        return NextResponse.json({ documents })
      }
        
      case 'count': {
        const [countDb, countCollection, countFilter = {}] = args
        const countColl = db.collection(countCollection)
        const count = await countColl.countDocuments(countFilter)
        return NextResponse.json({ count })
      }
        
      case 'insertMany': {
        const [insertDb, insertCollection, documents] = args
        const insertColl = db.collection(insertCollection)
        const documentsWithTimestamps = documents.map((doc: any) => ({
          ...doc,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
        const insertResult = await insertColl.insertMany(documentsWithTimestamps)
        return NextResponse.json({
          insertedIds: Object.values(insertResult.insertedIds).map(id => id.toString())
        })
      }
        
      case 'updateMany': {
        const [updateDb, updateCollection, updateFilter, updateData, updateOptions = {}] = args
        const updateColl = db.collection(updateCollection)
        const processedUpdate = {
          ...updateData,
          $set: {
            ...updateData.$set,
            updatedAt: new Date()
          }
        }
        const updateResult = await updateColl.updateMany(
          updateFilter, 
          processedUpdate,
          updateOptions
        )
        return NextResponse.json({ 
          modifiedCount: updateResult.modifiedCount,
          upsertedCount: updateResult.upsertedCount || 0
        })
      }
        
      case 'deleteMany': {
        const [deleteDb, deleteCollection, deleteFilter] = args
        const deleteColl = db.collection(deleteCollection)
        const deleteResult = await deleteColl.deleteMany(deleteFilter)
        return NextResponse.json({ deletedCount: deleteResult.deletedCount })
      }
        
      default:
        return NextResponse.json(
          { error: `Unsupported operation: ${operation}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('MongoDB operation error:', error)
    return NextResponse.json(
      { error: 'Database operation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    await db.admin().ping()
    return NextResponse.json({ 
      status: 'Connected to MongoDB Atlas',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB Atlas' },
      { status: 500 }
    )
  }
}