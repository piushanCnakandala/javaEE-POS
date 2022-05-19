package servlet;

import javax.annotation.Resource;
import javax.json.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet (urlPatterns = "/item")
public class ItemServlet extends HttpServlet {
    @Resource(name = "java:comp/env/jdbc/pool")
    DataSource dataSource;


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
        JsonObjectBuilder dataMsgBuilder = Json.createObjectBuilder();
        PrintWriter writer = resp.getWriter();

          Connection connection=null;
        try {
           connection =dataSource.getConnection();
            String option= req.getParameter("option");
           switch (option){
               case "GetAll":
                   ResultSet resultSet = connection.prepareStatement("SELECT * FROM item ").executeQuery();
                   String id = resultSet.getString(1);
                   String name = resultSet.getString(2);
                   int qty = resultSet.getInt(3);
                   double price = resultSet.getDouble(4);

                   objectBuilder.add("id", id);
                   objectBuilder.add("name", name);
                   objectBuilder.add("qty", qty);
                   objectBuilder.add("price", price);

                   arrayBuilder.add(objectBuilder.build());
           }
            dataMsgBuilder.add("data", arrayBuilder.build());
            dataMsgBuilder.add("massage", "Done");
            dataMsgBuilder.add("status", "200");

            writer.print(dataMsgBuilder.build());


        } catch (SQLException e) {
            e.printStackTrace();
        }


    }
}
