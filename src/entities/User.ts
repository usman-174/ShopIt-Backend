import { Entity as TOEntity, Column, Index } from "typeorm"

import Entity from "./Entity"

@TOEntity("users")
export default class User extends Entity {
  @Index()
  @Column({ unique: true })
  email: string

  @Index()
  @Column({ unique: true })
  username: string

  @Column()
  password: string
}
