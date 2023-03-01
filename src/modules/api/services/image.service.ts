import { Injectable } from '@nestjs/common';
import { chance } from 'src/utils/math';

const beasts = [
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-eTUNQjRqTvTtMEbBCZKlJQsA/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-00ivRNE00ijAFV3Vv5lbeZ3z/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-rdgJeFOvy0N4NFVRbHP1XrRG/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-Y5GRaqxCpoHRIdkIlSbsdrwh/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-qSCo4KPKExdXkUZJk8RFXHZH/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-aHpk4FwKQbFOp5XVzg1QeR1W/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-QgPIKtd9wKP8fRRAlKiU9Ym9/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-idnLEp5D57SzhW4eT2TyFcBZ/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-UzLxzAxFNAsf9yiUxEnT6xqu/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-YYCe4ExcDNQi3MkJUZX3mp3j/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-ub8wZ9q3saHXGZcu7q0UHxQL/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-bpFNTMtbQet2t8fQfDJvgvSw/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-hGROz5dXElBwZHSJehvhXMu4/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-COkMzd1DzndWlek4Em6U2hxb/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-a6JOLC6lm2yX86RgOOp2SHjD/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-JKEC7FfYs4qcXdRLnCchSiUb/image.webp',
];

const drop = [
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-7UiOLqvAihlv71I411QOB5C9/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-nwsduAkXx1cHVXdoHWGlf0CL/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-bgl87dgdww1Nhq8dNMBL30WH/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-tIAXzJPqRsgtih7LlmLDXsXo/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-7ApRQE9hDaH4DUHjod51i5kr/image.webp',
  'https://openai-labs-public-images-prod.azureedge.net/user-lb4SamTVdVnZ3GkP9vs6x3is/generations/generation-3L1jHaTNGKIrMqtV6XY9geY6/image.webp',
];

@Injectable()
export class ImageService {
  get default(): string {
    return 'https://www.rabrotech.com/upload/default/image-not-found.png';
  }

  async generateBeastImage(): Promise<string> {
    return chance.pickone(beasts);
  }

  getDropImage(): string {
    return chance.pickone(drop);
  }
}
