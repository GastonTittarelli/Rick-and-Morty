import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;
  //episodeId: string;
  @IsNumber()
  episodeId: number;
  //userId: number;
}
