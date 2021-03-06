import { DateTime } from "luxon"
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm"
import { ReactionTypes } from "App/Utils"
import { User, Post } from "App/Models"

export default class Reaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: ReactionTypes

  @column({ serializeAs: null })
  public userId: number

  @column({ serializeAs: null })
  public postId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
