import { Column, Model, Table, DataType } from 'sequelize-typescript'
import { calcBeastExperience, calcBeastLevel } from 'src/utils/experience'

@Table({
  modelName: 'beast'
})
export class BeastModel extends Model {
  @Column({
    type: DataType.INTEGER,
    defaultValue: null
  })
  userId: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  chatId: number

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  image: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  bones: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  experience: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isAlive: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  basicHealth: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  basicDamage: number

  @Column({
    type: DataType.STRING,
    defaultValue: null
  })
  action: string

  @Column({
    type: DataType.DATE,
    defaultValue: null
  })
  actionStart: Date

  get level(): number {
    if (this.experience)
      return calcBeastLevel(this.experience)
    else
      return -1
  }

  get nextLevel(): number {
    if (this.experience)
      return calcBeastLevel(this.experience) + 1
    else
      return -1
  }

  get levelExperience(): number {
    if (this.experience)
      return calcBeastExperience(this.level)
    else
      return -1
  }


  get nextLevelExperience(): number {
    if (this.experience)
      return calcBeastExperience(this.nextLevel)
    else
      return -1
  }

  get mappedNextLevelExperience(): number {
    if (this.experience)
      return this.nextLevelExperience - this.levelExperience
    else
      return -1
  }

  get mappedExperience(): number {
    if (this.experience)
      return this.experience - this.levelExperience
    else
      return -1
  }

  get health(): number {
    if (this.basicHealth && this.experience)
      return this.basicHealth + this.basicHealth * 0.4 * this.level
    else
      return -1
  }

  get damage(): number {
    if (this.basicDamage && this.experience)
      return this.basicDamage + this.basicDamage * 0.2 * this.level
    else
      return -1
  }

  get tameChance(): number {
    if (!this.experience || !this.basicHealth || !this.basicDamage) return -1

    let B = 10
    let sum = (this.experience * 0.4 + this.health * 0.2 + this.damage * 0.4) - (5 * 0.2 + 5 * 0.2 + 5 * 0.6)

    let A = Math.pow(sum, 1.3) - 7
    if (A < 1) A = 1

    const Pw = B / (A + B)
    return Pw
  }

  tame(userId: number): BeastModel {
    if (this.userId) throw Error('Can\'t tame already tamed Beast')

    this.userId = userId

    return this
  }

  rename(name?: string): BeastModel {
    const names = ['Пухнастик', 'Булка', 'Флаффі', 'Демогор']
    const random = Math.floor(Math.random() * names.length);
    this.name = name || names[random]

    return this
  }

  setAction(name?: string, startTime?: Date): BeastModel {
    const time = startTime || new Date()

    if (name) {
      this.action = name
      this.actionStart = time
    }
    else {
      this.action = null
      this.actionStart = null
    }

    return this
  }
}