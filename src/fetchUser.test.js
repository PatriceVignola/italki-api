/**
 * @prettier
 * @flow
 */

import fetch from 'node-fetch';

import fetchUser from './fetchUser';
import type {User} from './fetchUser';

require('node-fetch');

const json = {
  performance: '39.03 ms',
  meta: {},
  server_time: 1528460389000,
  data: {
    id: 123456,
    textid: 'T001234567',
    is_friend: 0,
    locale: 'en-us',
    learning_language: 'spanish',
    local_time_user: '2018-06-08T05:19:49-0700',
    avatar_file_name: '1T001234567',
    is_premium: 0,
    intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    user_detail_obj: {
      introduction: 'Donec aliquam vitae turpis vitae luctus.',
      interest: 'Suspendisse aliquet nec felis et accumsan.',
    },
    allow_content: 1,
    living_country_id: 'US',
    origin_country_id: 'KR',
    living_city_id: 'US00686', // Country code followed by 5 digits
    origin_city_id: 'KR00001', // Country code followed by 5 digits
    living_city_text_: 'Los Angeles',
    origin_city_text_: 'Seoul',
    living_city_name: '', // This seems to always be null or empty string
    origin_city_name: null,
    timezone: 'Pacific Standard Time',
    user_timezone_utc: 'UTC-07:00',
    user_timezone_location: 'United States (Los Angeles) Time',
    timezone_iana: 'America/Los_Angeles',
    language_obj_s: [
      {
        id: 1234567,
        has_course: 1,
        can_teach: 1,
        language: 'english',
        level: 7,
        priority: 1,
        is_teaching: 1,
        is_learning: 0,
      },
    ],
    badges: [],
    exam_result_shown_obj: null,
    register_status: 255,
    last_login_time: '2018-06-08T12:14:38+0000',
    friend_request_obj: null,
    first_purchase_time: null,
    register_time: '2011-08-09T22:01:49+0000',
    twitter_url: 'https://twitter.com/account/redirect_by_id?id=12345678',
    facebook_url: 'http://www.facebook.com/123456789',
    linkedin_url: 'http://www.linkedin.com/profile/view?id=Jkv4-8HylK',
    activity_points: 520,
    allow_message: 0,
    notebook_count: 0,
    friends_count: 214,
    is_blocker: 1,
    discussion_count: 6,
    has_skype: 1,
    is_online: 1,
    is_blockee: 1,
    nickname: 'LoremIpsum',
    is_tutor: 1,
    question_count: 0,
    student_z_course_session_is_public: 0,
    is_send_friend_request: 0,
    is_self: null,
    gender: 1,
    age: 0,
    session_count: 12,
    is_pro: 1,
    show_dob: 0,
    friend_list_is_public: 0,
  },
};

const avatarUrl = `https://imagesavatar-static01.italki.com/${
  json.data.avatar_file_name
}_Avatar.jpg`;
const genders = ['Unspecified', 'Female', 'Male'];

const expectedUser: User = {
  id: json.data.id,
  locale: json.data.locale,
  primaryLearningLanguage: json.data.learning_language,
  localTime: json.data.local_time_user,
  avatarUrl,
  premium: json.data.is_premium === 1,
  shortIntroduction: json.data.intro,
  longIntroduction: json.data.user_detail_obj.introduction,
  interest: json.data.user_detail_obj.interest,
  allowContent: json.data.allow_content === 1,
  livingCountryCode: json.data.living_country_id,
  originCountryCode: json.data.origin_country_id,
  livingCityCode: json.data.living_city_id,
  originCityCode: json.data.origin_city_id,
  // eslint-disable-next-line no-underscore-dangle
  originCityName: json.data.origin_city_text_,
  // eslint-disable-next-line no-underscore-dangle
  livingCityName: json.data.living_city_text_,
  timezone: json.data.timezone,
  timezoneUtc: json.data.user_timezone_utc,
  timezoneLocation: json.data.user_timezone_location,
  timezoneIana: json.data.timezone_iana,
  languages: json.data.language_obj_s.map(jsonLanguage => ({
    id: jsonLanguage.id,
    hasCourse: jsonLanguage.has_course === 1,
    canTeach: jsonLanguage.can_teach === 1,
    name: jsonLanguage.language,
    level: jsonLanguage.level,
    priority: jsonLanguage.priority,
    teaching: jsonLanguage.is_teaching === 1,
    learning: jsonLanguage.is_learning === 1,
  })),
  lastLoginTime: json.data.last_login_time,
  firstPurchaseTime: json.data.first_purchase_time,
  registerTime: json.data.register_time,
  twitterUrl: json.data.twitter_url,
  facebookUrl: json.data.facebook_url,
  linkedinUrl: json.data.linkedin_url,
  activityPoints: json.data.activity_points,
  allowMessage: json.data.allow_message === 1,
  notebookCount: json.data.notebook_count,
  friendCount: json.data.friends_count,
  discussionCount: json.data.discussion_count,
  hasSkype: json.data.has_skype === 1,
  online: json.data.is_online === 1,
  nickname: json.data.nickname,
  isTutor: json.data.is_tutor === 1,
  questionCount: json.data.question_count,
  gender: genders[json.data.gender],
  sessionCount: json.data.session_count,
  professional: json.data.is_pro === 1,
  friendListPublic: json.data.friend_list_is_public === 1,
};

describe('fetchUser', () => {
  it('parses response json into a user', async () => {
    fetch.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolve({
            ok: true,
            json: () => json,
          });
        }),
    );

    const user = await fetchUser(123456);
    expect(user).toEqual(expectedUser);
  });
});

describe('fetchUser', () => {
  it('sets avatarUrl to null if avatar_file_name is null', async () => {
    const otherJson = {
      ...json,
      data: {
        ...json.data,
        avatar_file_name: null,
      },
    };

    const otherExpectedUser = {
      ...expectedUser,
      avatarUrl: null,
    };

    fetch.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolve({
            ok: true,
            json: () => otherJson,
          });
        }),
    );

    const user = await fetchUser(123456);
    expect(user).toEqual(otherExpectedUser);
  });
});
