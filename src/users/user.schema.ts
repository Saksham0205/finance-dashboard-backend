import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../common/enums/role.enum';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({ type: String, enum: Role, default: Role.Viewer })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
