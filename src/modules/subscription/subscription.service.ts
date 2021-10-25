import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, Repository } from 'typeorm'
import { UserEntity } from '~/processors/database/entities/user.entity'
import { UserSubscriptionEntity } from '~/processors/database/entities/user_subscription.entity'
import { SubscriptionType } from './subscription.dto'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(UserSubscriptionEntity)
    private readonly userSubscriptionRepository: Repository<UserSubscriptionEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly connection: Connection,
  ) {}

  get repo() {
    return this.userSubscriptionRepository
  }

  private typeToField(type: SubscriptionType) {
    return {
      [SubscriptionType.Website]: 'site_id',
      [SubscriptionType.RSS]: 'srss_id',
      [SubscriptionType.Article]: 'article_id',
      [SubscriptionType.Email]: 'email_id',
    }[type]
  }

  async getTypeOfSubscription(type: SubscriptionType, id: string) {
    const entries = await this.repo.find({
      where: {
        [this.typeToField(type)]: id,
      },
    })
    // TODO  objects builder
    // TODO extract to a function
    const objects = {} as any
    objects.users = {}
    await Promise.all(
      entries.map(async (entry) => {
        objects.users[entry.user_id] = await this.connection
          .getRepository(UserEntity)
          .findOne(entry.user_id, {
            select: ['created_at', 'bio', 'name', 'id'],
          })
      }),
    )
    return [entries, objects] as const
  }

  async getUserSubscriptions(userId: string) {
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new BadRequestException('user not found')
    }

    return await this.userSubscriptionRepository
      .find({
        where: {
          user_id: user.id,
        },
        select: ['created_at', 'email_id', 'site_id', 'srss_id', 'article_id'],
      })
      .then((list) => {
        list.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if (Object.prototype.toString.call(item[key]) === '[object Null]') {
              delete item[key]
            }
          })
        })
        return list
      })
  }

  async subscribe(
    userId: string,
    type: SubscriptionType,
    subscriptionId: string,
  ) {
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new BadRequestException('user not found')
    }
    const typeToField = this.typeToField(type)
    const subscription = await this.userSubscriptionRepository.findOne({
      where: {
        user_id: user.id,
        [typeToField]: subscriptionId,
      },
    })

    if (subscription) {
      throw new BadRequestException('subscription already exists')
    }

    const newSubscription = new UserSubscriptionEntity()
    newSubscription.user_id = user.id

    newSubscription[typeToField] = subscriptionId

    await this.userSubscriptionRepository.save(newSubscription)
  }
}
