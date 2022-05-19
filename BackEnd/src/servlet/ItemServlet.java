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

        Connection connection = null;
        try {
           connection =dataSource.getConnection();
            String option= req.getParameter("option");
           switch (option){
               case "GetAll":
                   ResultSet resultSet = connection.prepareStatement("SELECT * FROM item ").executeQuery();
                   while (resultSet.next()){
                       String id = resultSet.getString(1);
                       String name = resultSet.getString(2);
                       int qty = resultSet.getInt(3);
                       double price = resultSet.getDouble(4);

                       resp.setStatus(HttpServletResponse.SC_OK);//201

                       objectBuilder.add("itemId", id);
                       objectBuilder.add("name", name);
                       objectBuilder.add("qtyOnHand", qty);
                       objectBuilder.add("unitPrice", price);

                       arrayBuilder.add(objectBuilder.build());
                   }

           }
            dataMsgBuilder.add("data", arrayBuilder.build());
            dataMsgBuilder.add("massage", "Done");
            dataMsgBuilder.add("status", "200");

            writer.print(dataMsgBuilder.build());

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }


    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String id = req.getParameter("itemId");
        String name = req.getParameter("name");
        int qty = Integer.parseInt(req.getParameter("qtyOnHand"));
        double price = Double.parseDouble(req.getParameter("unitPrice"));

        PrintWriter writer = resp.getWriter();
        Connection connection = null;
        try {
          connection= dataSource.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO item VALUES (?,?,?,?)");
            preparedStatement.setObject(1,id);
            preparedStatement.setObject(2,name);
            preparedStatement.setObject(3,qty);
            preparedStatement.setObject(4,price);

            if (preparedStatement.executeUpdate() >0){
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);
                objectBuilder.add("status", 200);
                objectBuilder.add("message", "Item Added success");
                objectBuilder.add("data", "");
                writer.print(objectBuilder.build());
            }

        } catch (SQLException throwables) {
            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            resp.setStatus(HttpServletResponse.SC_OK);
            objectBuilder.add("status", 400);
            objectBuilder.add("message", "Error");
            objectBuilder.add("data", throwables.getLocalizedMessage());
            writer.print(objectBuilder.build());
            throwables.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }


}
