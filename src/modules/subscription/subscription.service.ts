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
    // this.connection.manager.createQueryBuilder()
    return this.repo.find({
      where: {
        [this.typeToField(type)]: id,
      },
    })
  }

  async getUserSubscriptions(userId: string) {
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new BadRequestException('user not found')
    }

    return await this.userSubscriptionRepository.find({
      where: {
        user_id: user.id,
      },
      select: ['created_at', 'email_id', 'site_id', 'srss_id'],
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

    const typeToField = {
      site: 'site_id',
      email: 'email_id',
      srss: 'srss_id',
    }[type]

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
