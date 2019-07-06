using Microsoft.AspNetCore.SignalR;
using Microsoft.Spark.Sql;
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

            #region SetTypeRating

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

            #endregion SetTypeRating

            #region SetJobRating

            var jrList = Modles.SparkData.JobRating.ToList();
            jrList.Sort((v1, v2) =>
            {
                return -v1.Value.CompareTo(v2.Value);
            });
            _flag = 0;
            foreach (var item in jrList.Take(5))
            {
                remsg.ratings.occupation[_flag].name = item.Key;
                remsg.ratings.occupation[_flag++].rating = item.Value;
            }

            #endregion SetJobRating

            #region SetAreaRating

            //提前排序方式的尝试
            var arlist = Modles.SparkData.AreaRating.Take(6).ToList();
            //arlist.Sort((v1, v2) =>
            //{
            //    return -v1.Value.CompareTo(v2.Value);
            //});
            _flag = 0;
            foreach (var item in arlist)
            {
                remsg.ratings.area[_flag].name = item.Key;
                remsg.ratings.area[_flag++].rating = item.Value;
            }

            #endregion SetAreaRating

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
            //如果状态为失败或者未完成则返回失败
            if (!Modles.SparkData.Sata)
            {
                await Clients.Caller.SendAsync("GetAllAvgRatings", "400", "数据未响应", null);
                return;
            }

            var remsg = new ReMessage_getMovieList()
            {
                movieList = new ReMessage_getMovieList.MovieList[int.Parse(message.pageSize)]
            };

            //create temp view
            //筛选出了分数和名字
            Modles.SparkData.Spark.Sql($"select movies.movieId,title,genres,rating from movies,global_temp.MoviesRatings where rating >= {message.ratingRage[0]} and rating <= {message.ratingRage[1]} and title like '%{message.movieKeyName}%'").CreateTempView("TempMovieList");

            var _Movies = Modles.SparkData.Spark.Table("TempMovieList").Collect().ToDictionary(v1 => v1.Get(0).ToString());

            //进一步筛选标签
            if (message.movieType.Length > 0)
            {
                List<string> removeList = new List<string>();
                foreach (var movie in _Movies)
                {
                    //如果该电影不存在筛选标签，则移除
                    bool Fliter = true;
                    foreach (var tag in message.movieType)
                    {
                        if (movie.Value[2].ToString().Split("|").Contains(tag))
                        {
                            Fliter = false;
                            break;
                        }
                    }
                    if (Fliter)
                    {
                        removeList.Add(movie.Key);
                    }
                }
                //一定要出了迭代再删除
                foreach (var key in removeList)
                {
                    _Movies.Remove(key);
                }
            }

            //完成过滤，打包数据
            //处理页数超界异常
            if ((int.Parse(message.pageNo)) * int.Parse(message.pageSize) > _Movies.Count)
            {
                await Clients.Caller.SendAsync("GetMovieList", "201", "数据超界");
                return;
            }
            //分页获取，同时防止超界
            var _ReMovies = _Movies.ToList().GetRange(
                (int.Parse(message.pageNo) - 1) * int.Parse(message.pageSize),
                Math.Min(int.Parse(message.pageSize),
                    _Movies.Count - (int.Parse(message.pageNo) - 1) * int.Parse(message.pageSize)));

            var _flag = 0;
            //装载remsg
            foreach (var item in _ReMovies)
            {
                remsg.movieList[_flag] = new ReMessage_getMovieList.MovieList()
                {
                    movieId = _ReMovies[_flag].Value[0].ToString(),
                    movieName = _ReMovies[_flag].Value[1].ToString(),
                    movieType = _ReMovies[_flag].Value[2].ToString(),
                    rating = double.Parse(_ReMovies[_flag].Value[3].ToString())
                };
                _flag++;
            }

            await Clients.Caller.SendAsync("GetMovieList", "200", "成功", remsg);
        }

        public class ReMessage_getTypeList
        {
            public string[] typeArray;
        }

        /// <summary>
        /// http://www.xiaoyaoji.cn/doc/2jKfNNfDyG
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task GetTypeList(string user, RequestMessage message)
        {
            //如果状态为失败或者未完成则返回失败
            if (!Modles.SparkData.Sata)
            {
                await Clients.Caller.SendAsync("GetAllAvgRatings", "400", "数据未响应", null);
                return;
            }
            int size = Math.Min(int.Parse(message.size), Modles.SparkData.TypeRating.Keys.Count);
            var remsg = new ReMessage_getTypeList()
            {
                typeArray = new string[size]
            };

            //装载remsg
            var _tempDic = Modles.SparkData.TypeRating.Keys.ToList();
            for (int i = 0; i < size; i++)
            {
                remsg.typeArray[i] = _tempDic[i];
            }

            await Clients.Caller.SendAsync("GetTypeList", "200", "成功", remsg);
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
            //获取目标影片
            var movieInfo = Modles.SparkData.Movies.Select().Where(Modles.SparkData.Movies["movieId"] == message.movieId).Collect().FirstOrDefault();

            var remsg = new ReMessage_getMovieDetail()
            {
                movieId = movieInfo[0].ToString(),
                movieName = movieInfo[1].ToString(),
                movieType = movieInfo[2].ToString(),
                rating = Modles.SparkData.MoviesRating[message.movieId].Ratings,
                ratingNum = Modles.SparkData.MoviesRating[message.movieId].Numb,
                userTags = new ReMessage_getMovieDetail.UserTag[1]
                {
                    new ReMessage_getMovieDetail.UserTag()
                    {
                        content = "tag1",
                        name = "testUser"
                    }
                },
                userRatingDetails = new ReMessage_getMovieDetail.UserRatingDetail[10],
                ratings = new ReMessage_getMovieDetail.Rating[20]
            };

            //装载用户评分
            var _tempDetails = Modles.SparkData.Spark.Sql($"select userId,rating,from_unixtime(timestamp, 'yyyy-MM-dd HH:mm') from ratings,users where movieId = {message.movieId} order by timestamp desc").Take(10).ToList();
            var _flag = 0;
            foreach (var item in _tempDetails)
            {
                remsg.userRatingDetails[_flag].name = item[0].ToString();
                remsg.userRatingDetails[_flag].rating = double.Parse(item[1].ToString());
                remsg.userRatingDetails[_flag++].date = item[2].ToString();
            }

            //装载时间区域
            var _tempTimeRatings = Modles.SparkData.Spark.Sql($"select from_unixtime(timestamp, 'yyyy-MM-dd') as stamp ,Avg(rating) from mv where movieId = {message.movieId} group by from_unixtime(timestamp, 'yyyy-MM-dd') order by stamp desc").Take(20).ToList();
            _flag = 0;
            foreach (var item in _tempTimeRatings)
            {
                remsg.ratings[_flag].rating = double.Parse(item[1].ToString());
                remsg.ratings[_flag].date = item[0].ToString();
            }

            await Clients.Caller.SendAsync("GetMovieDetail", "200", "成功", remsg);
            //用字典管理更新连接池
            if (UserWithMID.ContainsKey(Clients.Caller))
            {
                UserWithMID[Clients.Caller] = message.movieId;
            }
            else
            {
                UserWithMID.Add(Clients.Caller, message.movieId);
            }
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

            public UserRatingDetail[] userRatingDetails;

            public Rating[] ratings;
        }

        /// <summary>
        /// 字典类型：客户端ID：正在查看的电影ID
        /// </summary>
        public static Dictionary<IClientProxy, int> UserWithMID = new Dictionary<IClientProxy, int>();

        /// <summary>
        /// http://www.xiaoyaoji.cn/doc/2jNMQxXvqQ
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public static async Task UpdateRating(string user, RequestMessage message)
        {
            while (true)
            {
                foreach (var item in UserWithMID)
                {
                    var remsg = new ReMessage_updateRating()
                    {
                        ratings = new ReMessage_updateRating.Rating[10],
                        userRatingDetails = new ReMessage_updateRating.UserRatingDetail[20],
                        userTags = new ReMessage_updateRating.UserTag[1]
                        {
                            new ReMessage_updateRating.UserTag()
                            {
                                name = "1",
                                content = "tag1"
                            }
                        }
                    };

                    //装载用户评分
                    var _tempDetails = Modles.SparkData.Spark.Sql($"select userId,rating,from_unixtime(timestamp, 'yyyy-MM-dd HH:mm') from ratings,users where movieId = {message.movieId} order by timestamp desc").Take(10).ToList();
                    var _flag = 0;
                    foreach (var item2 in _tempDetails)
                    {
                        remsg.userRatingDetails[_flag].name = item2[0].ToString();
                        remsg.userRatingDetails[_flag].rating = double.Parse(item2[1].ToString());
                        remsg.userRatingDetails[_flag++].date = item2[2].ToString();
                    }

                    //装载时间区域
                    var _tempTimeRatings = Modles.SparkData.Spark.Sql($"select from_unixtime(timestamp, 'yyyy-MM-dd') as stamp ,Avg(rating) from mv where movieId = {message.movieId} group by from_unixtime(timestamp, 'yyyy-MM-dd') order by stamp desc").Take(20).ToList();
                    _flag = 0;
                    foreach (var item2 in _tempTimeRatings)
                    {
                        remsg.ratings[_flag].rating = double.Parse(item2[1].ToString());
                        remsg.ratings[_flag].date = item2[0].ToString();
                    }

                    await item.Key.SendAsync("UpdateRating", "200", "成功");
                }
            }
        }

        /// <summary>
        /// http://www.xiaoyaoji.cn/doc/2jNbBgWRcD
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task AddUserComment(string user, RequestMessage message)
        {
            //Modles.SparkData.Ratings.A(1, message.rating.ToString(), message.tag);

            //Modles.SparkData.Ratings.Na().Fill(0);

            await Clients.Caller.SendAsync("AddUserComment", "200", "成功");
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            UserWithMID.Remove(Clients.User(Context.ConnectionId));
            return base.OnDisconnectedAsync(exception);
        }
    }
}