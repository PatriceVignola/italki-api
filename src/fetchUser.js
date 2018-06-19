/**
 * @prettier
 * @flow
 */
import fetch from 'node-fetch';

type UserJson = {
  +performance: string,
  +meta: Object,
  +server_time: number,
  +data: {
    +id: number,
    +textid: string, // `T00${id}0`
    +is_friend: 0 | 1, // Useless for us since the server doesn't have friends
    +locale: string, // TODO: Flow-type it
    +learning_language: string, // TODO: Flow-type it
    +local_time_user: string,
    +avatar_file_name: ?string,
    +is_premium: 0 | 1,
    +intro: ?string,
    +user_detail_obj: {
      introduction: string,
      interest: string,
    },
    +allow_content: 0 | 1,
    +living_country_id: string, // TODO: Flow-type it
    +origin_country_id: string, // TODO: Flow-type it
    +living_city_id: string, // Country code followed by 5 digits
    +origin_city_id: string, // Country code followed by 5 digits
    +living_city_text_: ?string,
    +origin_city_text_: ?string,
    +living_city_name: ?string, // This seems to always be null or empty string
    +origin_city_name: ?string, // This seems to always be null or empty string
    +timezone: string,
    +user_timezone_utc: string,
    +user_timezone_location: string,
    +timezone_iana: string,
    +language_obj_s: [
      {
        +id: number,
        +has_course: 0 | 1,
        +can_teach: 0 | 1,
        +language: string, // TODO: Flow-type it
        +level: 1 | 2 | 3 | 4 | 5 | 6 | 7,
        +priority: number,
        +is_teaching: 0 | 1,
        +is_learning: 0 | 1,
      },
    ],
    +badges: Object[], // TODO: Find a profile with badges and type it
    +exam_result_shown_obj: ?Object, // Not sure how to use it
    +register_status: number, // Not sure how to use this
    +last_login_time: string,
    +friend_request_obj: ?Object, // Not useful for us
    +first_purchase_time: ?string,
    +register_time: string,
    +twitter_url: ?string,
    +facebook_url: ?string,
    +linkedin_url: ?string,
    +activity_points: number,
    +allow_message: 0 | 1,
    +notebook_count: number,
    +friends_count: number,
    +is_blocker: 0 | 1, // Not sure how to use this
    +discussion_count: number,
    +has_skype: 0 | 1,
    +is_online: 0 | 1,
    +is_blockee: 0 | 1, // Not sure how to use this
    +nickname: string,
    +is_tutor: 0 | 1,
    +question_count: number,
    +student_z_course_session_is_public: 0 | 1, // Not sure how to use this
    +is_send_friend_request: 0 | 1, // Not useful for us
    +is_self: null | 0 | 1, // Not useful for us
    +gender: 0 | 1 | 2, // Unspecified | Female | Male
    +age: number, // Seems to always be 0, no matter what is the birthdate
    +session_count: number,
    +is_pro: 0 | 1,
    +show_dob: 0 | 1, // There doesn't seem to be away to set it to true
    +friend_list_is_public: 0 | 1,
  },
};

export type User = {
  +id: number,
  +locale: string, // TODO: Flow-type it
  +primaryLearningLanguage: string, // TODO: Flow-type it
  +localTime: string,
  +avatarUrl: ?string,
  +premium: boolean,
  +shortIntroduction: ?string,
  +longIntroduction: string,
  +interest: string,
  +allowContent: boolean,
  +livingCountryCode: string, // TODO: Flow-type it
  +originCountryCode: string, // TODO: Flow-type it
  +livingCityCode: string,
  +originCityCode: string,
  +originCityName: ?string,
  +livingCityName: ?string, // TODO: Flow-type it
  +timezone: string,
  +timezoneUtc: string,
  +timezoneLocation: string,
  +timezoneIana: string,
  +languages: {
    +id: number,
    +hasCourse: boolean,
    +canTeach: boolean,
    +name: string, // TODO: Flow-type it
    +level: 1 | 2 | 3 | 4 | 5 | 6 | 7,
    +priority: number,
    +teaching: boolean,
    +learning: boolean,
  }[],
  +lastLoginTime: string,
  +firstPurchaseTime: ?string,
  +registerTime: string,
  +twitterUrl: ?string,
  +facebookUrl: ?string,
  +linkedinUrl: ?string,
  +activityPoints: number,
  +allowMessage: boolean,
  +notebookCount: number,
  +friendCount: number,
  +discussionCount: number,
  +hasSkype: boolean,
  +online: boolean,
  +nickname: string,
  +isTutor: boolean,
  +questionCount: number,
  +gender: 'Unspecified' | 'Female' | 'Male',
  +sessionCount: number,
  +professional: boolean,
  +friendListPublic: boolean,
};

const avatarEndpoint = 'https://imagesavatar-static01.italki.com/';
const genders = ['Unspecified', 'Female', 'Male'];

async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(`https://www.italki.com/api/user/${userId}`);
  const json: UserJson = await response.json();
  const avatarUrl = json.data.avatar_file_name
    ? `${avatarEndpoint}${json.data.avatar_file_name}_Avatar.jpg`
    : null;

  return {
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
}

export default fetchUser;
