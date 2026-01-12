
import { Activity, User, ActivityUpdate } from './types.ts';

export const STORAGE_KEY_USER_ACTIVITIES = 'coucou_user_activities';

export const MOCK_USER: User = {
  id: 'user_1',
  name: '小凑君',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOFYQvXk23JKRY9DQMvyfkFbWrBGgJoNritczDGCeuymaLW0KfsnwPKQygIMNvAmUh1xKK1o_KDK2AEr9-WF-6p2LzZJU5o7GgZBSARVIDaZxBFTJqh9gcskYOLW-Wd2F9VLCl7HoIbSJcC4QZbGHYHzwMqZjE35ZRRtITmpMJGmlXFNjSYPBY5eebh59RWR0COaBhD7yEuQ9_SzcebHNU7v0-y83TDTk8-FOzPX8uOfCLJe6qMAEHLqtPjZFdwuQ5sfGxLxE07lay',
  creditScore: 98,
  stats: {
    started: 12,
    joined: 8,
    collected: 5
  }
};

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    title: '周五晚羽毛球进阶局',
    organizer: {
      name: 'Jason Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYyC5M1KIWMrCVuWrAhFCsdZu-UEMwWCQBlccxJJBBK1hc27XfgJ0MIkCj8HjQ5katZELidNlXLh1mrB4Y6lnx9pS4nwg-JJUCdAFuT684032whY2hYvJKu_Yvvw7CsAM4HAY3nBuAb_l5HsYz8Yz8k8bCRaM9Y0DbPmx1fDJvW4Y_cFNyKJA5G_oQN3Hs7e5b0TGv-31mTvYNzGNROeo0lEEAYPQWbTxjds5LnHdGBZPVteWNJU7gaA7uFsUsrbaEVpZ2Ag0dmM4Y',
      creditScore: 98
    },
    category: 'badminton',
    tag: '4.0+ Level',
    time: '2023-11-20 (周五) 19:00',
    location: '静安体育中心',
    address: '上海市静安区汶水路116号',
    costType: 'AA制',
    costDetail: '预计每人 ¥35-50',
    status: 'recruiting',
    maxParticipants: 8,
    participants: [
      { id: 'p1', name: 'Alice', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGQonHErpXOpoDIUNOmBqc_UJAq-JCLoLkVgdo0vf6QjDid9JSmRtjsJrNmzuatS5dQMW0DxOTtSnWvO6-FvVZtj__HJ6JVtLjii1QfqXpQ1Dno5IZWDgOc_5_Lx5kOP3BHLCftulAfI4AxcDXPlapUIYllbC-5mCvR36CDSd3dD9J3GKtPvz8kqCzudo_nojZFBWHEIeKRQxL94nQj7vcIxybGnMYKm7C4fR3MiQsEV1VxUjl0NQe9hbwHLiRlsPh_TSqomtsGAqt' },
      { id: 'p2', name: 'Bob', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTe-fKSQeRI95A-yqC7bQqb9cWwAsVHWkCsIZgMF4n7G-WQqIlVF6Ol8N4Z6qjwWDIRFxYDU8qi0CmTbMQee2KThmf-DwDzj9k2KSHzAw2GodKC8FWfew0Ch6mn60o5fBlBgVGedD4deACbL0OojCLcTKzybPu8MbBlTZevyx4WR98TR7KTNaJSiA7oKI_B6s-VSTFUmInR6nJYyFQy_o3LARe9rSZ65doCpUl3gKGQRJxtRFefHsnOX41vP8E5muXmuT5xeDTsg4R' }
    ],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB5Ej7VOmlVAuiNwxVTi9Bn13Vf0ZqlLmaq2h_bRvIsZ6u9PfHchh4-7-D1kF5Mw9CdPTZbtNEfrmZZ22uc6s7gGSBeuKULhJTiC1t1D_7J6ilxVAdMdzYSZwcVNhLj1yMpTlEgBIlrfrCCWWmuTZ2NLoiMHJV06jzCQQqH-OiGpe590vj2L3fAhkPFSCmslQQF5otXdSiWqUypO_W_OiT-bhxH_6kDmfXkd1iBToYZlcbynWU5uMFDtkxQoMP6GgUU7ZR_pIWJb2DU'],
    description: `👋 欢迎各位球友！本周五晚上在静安体育中心定了一个场，主要是想找几个水平相当的朋友一起切磋一下。`
  },
  {
    id: 'act_2',
    title: '喜茶拼单 - 满减',
    organizer: {
      name: '奶茶控',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlQbAYWMsrSTc-wywYMUG4qOB5gNGI6zvi3Vq1hRSxGa2FpvtmTdFmgXmMTioYY7XtET8vxw7u2GSSAmyH7TzyCBSenpDUY12eS1CqSfxbQk3x4ZiR7AU9k3bTPMmtXD6UFx96mAobHFdPeh2VKI-XTr1x7wC8iQrJTlUvSzzAAKOI9vb8f6YD2QyfdEFZKqSxpBcFPON8gN_4H_9g64_wnUrrd1a35pNn-EViJaP_QBsyhi2MJNRo9dg_soJqQWhTxQdDnfYX7ZTE',
      creditScore: 99
    },
    category: 'group_buy',
    tag: '拼团中',
    time: '今天 14:30 截止',
    location: '科技园大厦 A座',
    address: '深圳市南山区科苑路',
    costType: '拼单',
    costDetail: '满100减40',
    status: 'recruiting',
    maxParticipants: 10,
    participants: [
      { id: 'p6', name: 'User1', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjuuGNwaT4d_mXzpAsXV9A70XgZRAK7W06_g7ZXjuXfFOnbjM77ftfBj1Tt1lz1U-i5o7AirK04xApLNDmzZWMg2ZF7RUvS0f4pZGZ1e2YKloiWIuNsVE49InnaJ_xFhg39H3CuZZnc9y2YJ36ZVoqEsgDCtvZFLgnFMfJ5YSgX-MAjg39yhQUBZ-vgtaB7yDtDwrVXl58Q4X3mKuERcCDiPkmAi1biisTi99VBNmOntm92TJ1iMhPb35NlNtE9fNicM2qcY_1f70F' }
    ],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCrffBsEMchD2jadJFZOEo6a9GPiSho9dDmYjb6t9sXPoMfdFBJqy6dB03b_CRsUo2gIBXN7q8O42BPtbz1KQT-oZJdXJvqAutaQnCo5DnR17v-gt5Ldy-AOrcFrHuFEl-FdyTUGmbBwIxoTAwZW2GxqYL336qfw-4oVgSkaWLOEh458lwznja2WtGz-NeYufyP5sFviMQwn1lkjMVXOGJ7lFG1YQ-hhHiMl1qxUxdKFWlTQ_HhaoyUVlvmnljRH9KgfktDRNIJfiyl'],
    description: '下午茶拼喜茶，还差3个人起送满减！'
  },
  {
    id: 'act_3',
    title: '南山科技园篮球 3v3',
    organizer: {
      name: '篮球之友',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTe-fKSQeRI95A-yqC7bQqb9cWwAsVHWkCsIZgMF4n7G-WQqIlVF6Ol8N4Z6qjwWDIRFxYDU8qi0CmTbMQee2KThmf-DwDzj9k2KSHzAw2GodKC8FWfew0Ch6mn60o5fBlBgVGedD4deACbL0OojCLcTKzybPu8MbBlTZevyx4WR98TR7KTNaJSiA7oKI_B6s-VSTFUmInR6nJYyFQy_o3LARe9rSZ65doCpUl3gKGQRJxtRFefHsnOX41vP8E5muXmuT5xeDTsg4R',
      creditScore: 95
    },
    category: 'basketball',
    tag: '野球局',
    time: '周日 17:00',
    location: '海德篮球场',
    address: '深圳市南山区',
    costType: '免费',
    costDetail: '自备装备',
    status: 'recruiting',
    maxParticipants: 6,
    participants: [],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD54VNdHpKbv2mgyWGEv9U-Q0ZVysP9Io9JmHMr-K_xlsZCApFLRbVHIq_OIIEcBw4EX5_qCA2n7YCrnV8t-g3gz2cRnUR4p2nE9fro9GNZ_4_kcGcM0yI7pMSK_NZYdyNgzUwunke_OZfoYv9aArxKCWn3wTVHeUdt2KYdAPpLTYij1_6HsNUiBe_lGOGLLj4odeVtmr35_LykgCfPGwRMuuFYRCY8apqxHQmZGVsD3NHTwEUE1GNLz-_E46acvY_IEHiRc8Sw82Pp'],
    description: '周末下午打场球，出出汗，欢迎各路好手。'
  },
  {
    id: 'act_4',
    title: '剧本杀《明月几时有》',
    organizer: {
      name: 'DM小王',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGQonHErpXOpoDIUNOmBqc_UJAq-JCLoLkVgdo0vf6QjDid9JSmRtjsJrNmzuatS5dQMW0DxOTtSnWvO6-FvVZtj__HJ6JVtLjii1QfqXpQ1Dno5IZWDgOc_5_Lx5kOP3BHLCftulAfI4AxcDXPlapUIYllbC-5mCvR36CDSd3dD9J3GKtPvz8kqCzudo_nojZFBWHEIeKRQxL94nQj7vcIxybGnMYKm7C4fR3MiQsEV1VxUjl0NQe9hbwHLiRlsPh_TSqomtsGAqt',
      creditScore: 97
    },
    category: 'mystery_game',
    tag: '烧脑神作',
    time: '周六 13:00',
    location: '谜之屋推理馆',
    address: '长宁区中山公园',
    costType: '付费',
    costDetail: '168元/人',
    status: 'recruiting',
    maxParticipants: 6,
    participants: [],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCsxT2fyyB7FLmUAJKaVT--aEBU9MApzmUplTvgjhKVw3VnWDNfeZdvnHK5yknUVSWelUeCDMcN1OKYbrg19gsTGHvOh2HUFw-hiRYYqc2CERQEN0IaV2dpEEV_nLojPQ6ezWWzozpxmAbs99BV-dRwe1uUahK0FYGoehztntrotUwATgj0Wxvh6nvXHB8ZuTV4SEIU_rEKoGadDdVTfhzOvoFtWiYHy9NMjQ2tMjedTJR2CL6G1IBo7mcbMym5Jff5dpXk1oAVD1cy'],
    description: '本格推理，缺2人，来几个老手或者爱思考的新人。'
  }
];

export const MOCK_UPDATES: ActivityUpdate[] = [
  {
    id: 'upd_1',
    activityId: 'act_2',
    activityTitle: '喜茶拼单 - 满减',
    type: 'progress',
    content: '拼团进度更新：已有 8 人加入，还差 2 人成团！',
    time: '5分钟前',
    progress: 80,
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjuuGNwaT4d_mXzpAsXV9A70XgZRAK7W06_g7ZXjuXfFOnbjM77ftfBj1Tt1lz1U-i5o7AirK04xApLNDmzZWMg2ZF7RUvS0f4pZGZ1e2YKloiWIuNsVE49InnaJ_xFhg39H3CuZZnc9y2YJ36ZVoqEsgDCtvZFLgnFMfJ5YSgX-MAjg39yhQUBZ-vgtaB7yDtDwrVXl58Q4X3mKuERcCDiPkmAi1biisTi99VBNmOntm92TJ1iMhPb35NlNtE9fNicM2qcY_1f70F'
  }
];
