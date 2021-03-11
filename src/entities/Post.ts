import {
  Entity as TOEntity,
  Column,
  
} from 'typeorm'
import Entity from './Entity'


@TOEntity('posts')
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super()
    Object.assign(this, post)
  }
 
  @Column()
  title: string

 

  @Column({ nullable: true, type: 'text' })
  body: string

  

}
