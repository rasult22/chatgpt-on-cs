export enum PlatformTypeEnum {
  HOT = 'HOT',
  E_COMMERCE = 'E_COMMERCE',
  ME_MEDIA = 'ME_MEDIA',
  RECRUIT = 'RECRUIT',
  OTHER = 'OTHER',
  LAW = 'LAW',
}

export const PlatformTypeMap = {
  [PlatformTypeEnum.HOT]: 'Популярные',
  [PlatformTypeEnum.E_COMMERCE]: 'Электронная коммерция',
  [PlatformTypeEnum.RECRUIT]: 'Подбор персонала',
  [PlatformTypeEnum.LAW]: 'Юридические консультации',
  [PlatformTypeEnum.ME_MEDIA]: 'Блогеры',
  [PlatformTypeEnum.OTHER]: 'Другое',
};
