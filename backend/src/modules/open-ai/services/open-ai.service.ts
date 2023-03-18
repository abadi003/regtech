import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { OpenAiDto } from '../types/open-ai.dto';

dotenv.config();

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly config = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  private readonly openai = new OpenAIApi(this.config);

  async getOpenAi(dto: OpenAiDto): Promise<any> {
    console.time('openai');
    const prompt = await this.formatMessage(dto);
    const body = {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 3000,
      temperature: 0.7,
      top_p: 1,
    };
    try {
      const response = await this.openai.createCompletion(body);
      console.timeEnd('openai');
      const result = response.data.choices[0].text;
      // trim the result to the after 1.
      const index = result.indexOf('1.');
      return {result:result.trimStart().substring(index)};
      console.log(response.data.choices[0].text);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
  private async formatMessage(dto: OpenAiDto): Promise<string> {
    const { CompanyName, CompanySize, RegulationName, sectorName } = dto;
    let result = `تصرف وكأنك نظام يقوم بأنشاء لوائح الحوكمة للشركات السعودية, اكتبي لوائح للمادة ${RegulationName} للشركة ${CompanyName} بقطاع ${sectorName}من خلال البحث عن لوائح شركة  ${CompanySize} وإعادة صياغتها بشكل نقاط من غير تكرار لوائح التي تتعلق بالمادة ${RegulationName}  بدون ذكر تفاصيل وبدون ذكر ${CompanySize} `;
    if (dto.moreDetails) {
      result += `مع الاخذ بالحسبان ${dto.moreDetails} بصياغة اللوائح`;
    }
    return result;
  }
}
