import { DateTime } from "luxon"
import {
  BaseModel,
  column,
  hasOne,
  HasOne,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  computed
} from "@ioc:Adonis/Lucid/Orm"
import { User, File, Comment, Reaction } from "App/Models"

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column({ serializeAs: null })
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => File, {
    foreignKey: "ownerId",
    onQuery: (query) => query.where({ fileCategory: "post" })
  })
  public media: HasOne<typeof File>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Reaction, { serializeAs: null })
  public reactions: HasMany<typeof Reaction>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get commentsCount() {
    return this.$extras.comments_count
  }

  @computed()
  public get reactionsCount() {
    return {
      like: this.$extras.like_count || 0,
      love: this.$extras.love_count || 0,
      haha: this.$extras.haha_count || 0,
      sad: this.$extras.sad_count || 0,
      angry: this.$extras.angry_count || 0
    }
  }

  @computed()
  public get activeReaction() {
    return this.reactions && this.reactions.length ? this.reactions[0].type : null
  }
}
