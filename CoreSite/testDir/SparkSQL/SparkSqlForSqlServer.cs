using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Spark.Sql.Streaming;
using Microsoft.Spark.Sql;
using static Microsoft.Spark.Sql.Functions;
using System.Timers;

namespace CoreSite.testDir.SparkSQL
{
    public class SparkSqlForSqlServer
    {
        /// <summary>
        /// test data frame
        /// </summary>
        private static DataFrame tsRSDF;

        public static async Task ReadData(SparkSession sparkSession)
        {
            DataFrame df;

            //更建议使用配置文件方式进行连接
            //这里作为测试就不多整了
            await Task.Run(() =>
            {
                #region 读取

                testDataFrame.dataFrame =
                  sparkSession.Read().Format("jdbc")
                    .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                    .Option("databaseName", "sparkDB")
                    .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                    .Option("dbtable", "ratings")
                    .Option("user", "spark")
                    .Option("password", "aspcore")
                    .Load();
                //sparkSession.Read().Format("jdbc")
                //  .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                //  .Option("databaseName", "sparkDB")
                //  .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                //  .Option("dbtable", "users")
                //  .Option("user", "spark")
                //  .Option("password", "aspcore")
                //  .Load()
                //  .CreateOrReplaceTempView("users");
                df = testDataFrame.dataFrame;

                #endregion 读取

                df.CreateTempView("mv");
                Console.WriteLine("开始查询");

                //sparkSession.Sql("select title from movies where title like '%ss%'").Show();

                sparkSession.Sql("select from_unixtime(timestamp, 'yyyy-MM-dd') as stamp ,movieId,Avg(rating) from mv group by from_unixtime(timestamp, 'yyyy-MM-dd'),movieId having movieId = 1441 order by stamp desc").CreateTempView("TestTable");
                //失败sparkSession.Sql("insert into table TestTable  VALUES(2019-1-1, 1442, 5)").Show();

                //Modles.SparkData.Spark.Sql("select `Zip-code` , Sum(rating)/Count(rating) as rating  from users,ratings  where users.UserID = ratings.userId  Group by `Zip-code` Order by rating desc");

                Console.WriteLine("查询完成");
                //df.Select().GroupBy("").Agg(Avg(df["rating"])).Write();

                #region 创建局部临时表并访问

                /*
                testDataFrame.dataFrame.CreateOrReplaceTempView("TestTableUseSP");

                sparkSession.Table("TestTableUseSP").Show();
                */

                #endregion 创建局部临时表并访问

                #region 创建全局临时表并访问

                /*
                testDataFrame.dataFrame.CreateGlobalTempView("TestTableUseSP");

                sparkSession.Table("global_temp.TestTableUseSP").Show();
                */

                #endregion 创建全局临时表并访问

                /*

                #region ShowTest

                //直接利用df输出
                df.Select(df["ttuser"], df["ttage"] + 1).Show();
                Console.WriteLine("通过select用df指定输出,在其中修改值");

                //通过select选择指定列输出
                df.Select("ttuser", "ttmessage").Show();
                Console.WriteLine("通过select选择指定列输出");

                //通过where和Like选择列输出
                df.Where(df["ttuser"].Like("%up%")).Show();
                Console.WriteLine("通过where和Like选择列输出");

                //混合select和where筛选同时输出
                df.Select(df["ttuser"], df["ttage"]).Where(df["ttuser"].Like("%up%")).Where(df["ttage"] + 1 < 10).Show();
                Console.WriteLine("混合select和like筛选同时输出");

                #endregion ShowTest

                */

                #region 写入

                /*
                testDataFrame.dataFrame.Write().Format("jdbc")
                  .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                  .Option("databaseName", "sparkDB")
                  .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                  .Option("dbtable", "TestTable")
                  .Option("user", "spark")
                  .Option("password", "aspcore")
                  .Save();
                  */

                #endregion 写入
            });
        }

        public static async Task StreamingRead(SparkSession sparkSession)
        {
            await Task.Run(() =>
            {
                tsRSDF = sparkSession.ReadStream()
                .Option("sep", ";")
                //.Option("header", "true")
                .Schema("ttuser string, ttmessage string, ttage integer")
                //.Schema("userId integer, movieId integer, rating double, timestamp string")
                .Csv("file:///mnt/e/OneDrive/WorkingSpace/TestDir/ReadStreamTest/input/");

                //文本或者网页->Sql server -> 流读入Sql，运行以下计算后再次推送至临时表
                tsRSDF
                    .WriteStream().Format("jdbc")
                    .Option("url", "jdbc:sqlserver://127.0.0.1:1433")
                    .Option("databaseName", "sparkDB")
                    .Option("driver", "com.microsoft.sqlserver.jdbc.SQLServerDriver")
                    .Option("dbtable", "TestTable")
                    .Option("user", "spark")
                    .Option("password", "aspcore")
                    .Start()
                    .AwaitTermination();
            });
        }

        public static void StreamingDeal(SparkSession sparkSession)
        {
            //Console.WriteLine("In SD");
            //Console.WriteLine(tsRSDF.IsStreaming());
            //if (tsRSDF.IsStreaming())
            //{
            //    Console.WriteLine("In SSD");
            //    var output = 0d;
            //    tsRSDF.CreateOrReplaceTempView("Update");
            //    sparkSession.Sql("select movieId,sum(rating) from Update group by movieId")
            //        .WriteStream()
            //        .OutputMode("complete")
            //        .Format("console")
            //        .Start();
            //}
            //Console.WriteLine("End SD");
        }
    }
}