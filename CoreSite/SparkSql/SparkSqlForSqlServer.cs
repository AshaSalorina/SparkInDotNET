using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Spark.Sql;
using static Microsoft.Spark.Sql.Functions;

namespace CoreSite.SparkSql
{
    public class SparkSqlForSqlServer
    {
        public static async Task UpdateDataFromDB()
        {
            while (true)
            {
                Modles.SparkData.Sata = Update();
                //10 minutes to update data
                await Task.Delay(TimeSpan.FromHours(24));
            }
        }

        private static bool Update()
        {
            try
            {
                #region Movies

                Modles.SparkData.Movies = Modles.SparkData.Spark.Read().Format("jdbc")
                    .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                    .Option("databaseName", "sparkDB")
                    .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                    .Option("dbtable", "movies")
                    .Option("user", "spark")
                    .Option("password", "aspcore")
                    .Load();
                Modles.SparkData.Movies.CreateOrReplaceGlobalTempView("movies");

                #endregion Movies

                Console.WriteLine("Log:Movies is loaded");

                #region Ratings

                Modles.SparkData.Ratings = Modles.SparkData.Spark.Read().Format("jdbc")
                    .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                    .Option("databaseName", "sparkDB")
                    .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                    .Option("dbtable", "ratings")
                    .Option("user", "spark")
                    .Option("password", "aspcore")
                    .Load();
                Modles.SparkData.Ratings.CreateOrReplaceGlobalTempView("ratings");

                #endregion Ratings

                Console.WriteLine("Log:Ratings is loaded");

                #region Users

                Modles.SparkData.Users = Modles.SparkData.Spark.Read().Format("jdbc")
                    .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                    .Option("databaseName", "sparkDB")
                    .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                    .Option("dbtable", "users")
                    .Option("user", "spark")
                    .Option("password", "aspcore")
                    .Load();
                Modles.SparkData.Users.CreateOrReplaceGlobalTempView("users");

                #endregion Users

                Console.WriteLine("Log:Users is loaded");

                //create  MoviesRatings like "movieId,rating"
                Modles.SparkData.Spark.Sql("select movieId, sum(rating)/Count(rating) as `rating` ,Count(rating) as `numb` from global_temp.ratings group by movieId").CreateOrReplaceGlobalTempView("MoviesRatings");

                //convert to dic
                Modles.SparkData.MoviesRating = Modles.SparkData.Spark.Table("global_temp.MoviesRatings").Collect().ToDictionary(
                    i => int.Parse(i[0].ToString()),
                    i => new Modles.SparkData.Rating()
                    {
                        Numb = int.Parse(i[2].ToString()),
                        Ratings = double.Parse(i[1].ToString())
                    }
                    );

                Console.WriteLine("Log:MoviesRating is calculated");

                //create SexRatings like "Gender,rating"
                Modles.SparkData.Spark.Sql("select Gender, Sum(rating)/Count(rating) as `rating` from global_temp.users, global_temp.ratings where global_temp.users.UserID = global_temp.ratings.userId group by Gender").CreateOrReplaceGlobalTempView("SexRatings");

                Console.WriteLine("Log:SexRating is calculated");

                //create JobRatings like "occupation,rating"
                //已排序
                Modles.SparkData.Spark.Sql("select Occupation, Sum(rating)/Count(rating) as `rating` from global_temp.users,global_temp.ratings where global_temp.users.UserID = global_temp.ratings.userId Group by Occupation Order by rating desc").CreateOrReplaceGlobalTempView("JobRatings");
                //convert to dic
                Modles.SparkData.JobRating = Modles.SparkData.Spark.Table("global_temp.JobRatings").Collect().ToDictionary(i => i[0].ToString(), i => double.Parse(i[1].ToString()));

                Console.WriteLine("Log:JobRating is calculated and sorted");

                //create AreaRatings like "zip-code,rating"
                //已排序和截取
                Modles.SparkData.Spark.Sql("select `Zip-code` , Sum(rating)/Count(rating) as rating  from global_temp.users,global_temp.ratings  where global_temp.users.UserID = global_temp.ratings.userId  Group by `Zip-code` Order by rating desc").CreateOrReplaceGlobalTempView("AreaRatings");
                //convert to dic
                Modles.SparkData.AreaRating = Modles.SparkData.Spark.Table("global_temp.AreaRatings").Collect().ToDictionary(i => i[0].ToString(), i => double.Parse(i[1].ToString()));

                Console.WriteLine("Log:AreaRating is calculated and sorted");

                Console.WriteLine("Log:Now Update TypeRating");
                UpdateTypeRating();
                Console.WriteLine("Log:TypeRating done");

                Console.WriteLine("Log:[Succece]:All data are loaded");
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 更想Type表单
        /// </summary>
        private static void UpdateTypeRating()
        {
            //create TypeRatings as new
            Dictionary<string, List<int>> tyR = new Dictionary<string, List<int>>();

            //做了一次手动md，等效于df.foreach（可惜c#没有那种写法
            //map
            foreach (var item in Modles.SparkData.Movies.Collect())
            {
                foreach (var item2 in item[2].ToString().Split('|'))
                {
                    //if have key item2 add this movie to dic
                    if (tyR.ContainsKey(item2))
                    {
                        tyR[item2].Add(int.Parse(item[0].ToString()));
                    }
                }
            }
            //reduce
            foreach (var item in tyR)
            {
                var sum = 0d;
                //avg for each type ratingas
                foreach (var item2 in item.Value)
                {
                    sum += Modles.SparkData.MoviesRating[item2].Ratings;
                }
                sum /= item.Value.Count;
                //into dic
                if (Modles.SparkData.TypeRating.ContainsKey(item.Key))
                {
                    Modles.SparkData.TypeRating[item.Key] = sum;
                }
                else
                {
                    Modles.SparkData.TypeRating.Add(item.Key, sum);
                }
            }
        }
    }
}