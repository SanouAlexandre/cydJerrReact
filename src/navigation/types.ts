import { NavigatorScreenParams } from '@react-navigation/native';

// Main Stack Navigator params
export type RootStackParamList = {
  Index: undefined;
  Login: undefined;
  Signup: undefined;
  EmailVerification: undefined;
  Home: undefined;
  CydJerrNation: undefined;
  JoyJerr: NavigatorScreenParams<JoyJerrStackParamList>;
  KidJerr: undefined;
  NewsJerr: undefined;
  CapiJerr: undefined;
  ChabJerr: undefined;
  EvenJerr: undefined;
  PiolJerr: undefined;
  VagoJerr: undefined;
  SpeakJerr: undefined;
  JobJerr: undefined;
  CodeJerr: undefined;
  LeaseJerr: undefined;
  StarJerr: undefined;
  TeachJerr: undefined;
  CloudJerr: undefined;
  AssuJerr: undefined;
  FundingJerr: undefined;
  AvoJerr: undefined;
  ShopJerr: undefined;
  ImmoJerr: undefined;
  DoctoJerr: undefined;
  AppJerr: undefined;
  DomJerr: undefined;
  PicJerr: undefined;
  SmadJerr: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
  NotFound: undefined;
};

// JoyJerr Stack Navigator params
export type JoyJerrStackParamList = {
  JoyJerrIndex: undefined;
  JoyJerrCommunity: undefined;
  JoyJerrMembers: undefined;
  JoyJerrPages: undefined;
  JoyJerrGroups: undefined;
  JoyJerrBlog: undefined;
  JoyJerrProfile: undefined;
};

// Tab Navigator params
export type TabParamList = {
  TabHome: undefined;
  Explore: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}