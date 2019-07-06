using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreSite.SignalCenter
{
    public class SignalCenter : Hub
    {
        public class RequestMessage
        {
            public string type;
            public double[] ratingRage;
            public string[] movieType;
            public string movieKeyName;
            public string pageNo;
            public string pageSize;
            public string size;
            public int movieId;
            public string name;
            public double rating;
            public string tag;
        }

        #region notuse

        /*
        private class ResponseMessage
        {
            public class Ratings
            {
                public class Sex
                {
                    public double men;
                    public double women;
                }

                public Sex sex;

                public class Type
                {
                    public string name;
                    public double rating;
                }

                public Type[] type;

                public class Occupation
                {
                    public string name;
                    public double rating;
                }

                public Occupation[] occupation;

                public class Area
                {
                    public string name;
                    public double rating;
                }

                public Area[] area;
            }

            public class MovieList
            {
                public string movieId;
                public string movieName;
                public string movieType;
                public double rating;
            }

            public class UserTags
            {
                public string name;
                public string content;
            }

            public class UserRatingDetails
            {
                public string name;
                public double rating;
                public string date;
            }

            public int code;
            public string info;
            public Ratings ratings;
            public MovieList[] movieLists;
            public string[] typeArray;

            public string movieId;
            public string movieName;
            public string movieType;
            public double rating;
            public double ratingNum;
        }
        */

        #endregion notuse

        public async Task ExampleFunction(string ags1)
        {
            await Clients.Caller.SendAsync("ExampleFunction", "arg1");
        }

        public class ReMessage_getAllAvgRatings
        {
            public class Ratings
            {
                public class Sex
                {
                    public double men;
                    public double women;
                }

                public Sex sex;

                public class Type
                {
                    public string name;
                    public double rating;
                }

                public Type[] type;

                public class Occupation
                {
                    public string name;
                    public double rating;
                }

                public Occupation[] occupation;

                public class Area
                {
                    public string name;
                    public double rating;
                }

                public Area[] area;
            }

            public Ratings ratings;
        }

        /// <summary>
        /// 接口描述:http://www.xiaoyaoji.cn/doc/2jIUdSBwcT
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task GetAllAvgRatings(string user, RequestMessage message)
        {
            //如果状态为失败或者未完成则返回失败
            if (!Modles.SparkData.Sata)
            {
                await Clients.Caller.SendAsync("GetAllAvgRatings", "400", "数据未响应", null);
                return;
            }
            //create a temp dic
            var tempDic = Modles.SparkData.Spark.Table("global_temp.SexRatings").Collect()
                .ToDictionary(i => i[0].ToString(), i => double.Parse(i[1].ToString()));

            //build a remsg
            var remsg = new ReMessage_getAllAvgRatings()
            {
                ratings = new ReMessage_getAllAvgRatings.Ratings()
                {
                    sex = new ReMessage_getAllAvgRatings.Ratings.Sex()
                    {
                        men = tempDic["M"],
                        women = tempDic["F"]
                    },
                    type = new ReMessage_getAllAvgRatings.Ratings.Type[6],
                    occupation = new ReMessage_getAllAvgRatings.Ratings.Occupation[5],
                    area = new ReMessage_getAllAvgRatings.Ratings.Area[6]
                }
            };

            #region SetType

            //sort from big to small
            var trList = Modles.SparkData.TypeRating.ToList();
            trList.Sort((v1, v2) =>
            {
                return -v1.Value.CompareTo(v2.Value);
            });
            //set type
            int _flag = 0;
            foreach (var item in trList.Take(6))
            {
                remsg.ratings.type[_flag].name = item.Key;
                remsg.ratings.type[_flag++].rating = item.Value;
            }

            #endregion SetType

            await Clients.Caller.SendAsync("GetAllAvgRatings", "200", "成功", remsg);
        }

        public class ReMessage_getMovieList
        {
            public class MovieList
            {
                public string movieId;
                public string movieName;
                public string movieType;
                public double rating;
            }

            public MovieList[] movieList;
        }

        /// <summary>
        /// http://www.xiaoyaoji.cn/doc/2jJ6fWSHf7
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task GetMovieList(string user, RequestMessage message)
        {
            await Clients.Caller.SendAsync("ExampleFunction", "arg1");
        }

        public class ReMessage_getTypeList
        {
            private string[] typeArray;
        }

        /// <summary>
        /// http://www.xiaoyaoji.cn/doc/2jKfNNfDyG
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task GetTypeList(string user, RequestMessage message)
        {
            await Clients.Caller.SendAsync("ExampleFunction", "arg1");
        }

        public class ReMessage_getMovieDetail
        {
            public class UserTag
            {
                public string name;
                public string content;
            }

            public class UserRatingDetail
            {
                public string name;
                public double rating;
                public string date;
            }

            public class Rating
            {
                public double rating;
                public string date;
            }

            public string movieId;
            public string movieName;
            public string movieType;
            public double rating;
            public int ratingNum;
            public UserTag[] userTags;
            public UserRatingDetail[] userRatingDetails;
            public Rating[] ratings;
        }

        /// <summary>
        /// http://www.xiaoyaoji.cn/doc/2jLQGNMixd
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task GetMovieDetail(string user, RequestMessage message)
        {
            await Clients.Caller.SendAsync("ExampleFunction", "arg1");
        }

        public class ReMessage_updateRating
        {
            public class UserTag
            {
                public string name;
                public string content;
            }

            public class UserRatingDetail
            {
                public string name;
                public double rating;
                public string date;
            }

            public class Rating
            {
                public double rating;
                public string date;
            }

            public UserTag[] userTags;

            public UserRatingDetail[] UserRatingDetails;

            public Rating[] ratings;
        }

        /// <summary>
        /// http://www.xiaoyaoji.cn/doc/2jNMQxXvqQ
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task UpdateRating(string user, RequestMessage message)
        {
            await Clients.Caller.SendAsync("ExampleFunction", "arg1");
        }

        /// <summary>
        /// http://www.xiaoyaoji.cn/doc/2jNbBgWRcD
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task AddUserComment(string user, RequestMessage message)
        {
            await Clients.Caller.SendAsync("ExampleFunction", "arg1");
        }
    }
}