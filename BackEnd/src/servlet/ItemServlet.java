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
                   dataMsgBuilder.add("data", arrayBuilder.build());
                   dataMsgBuilder.add("massage", "Done");
                   dataMsgBuilder.add("status", "200");

                   writer.print(dataMsgBuilder.build());
                   break;


               case "GenId":
                   ResultSet genId = connection.prepareStatement("SELECT itemId FROM item ORDER BY itemId DESC LIMIT 1").executeQuery();
                   if (genId.next()){
                       int tempId = Integer.parseInt(genId.getString(1).split("-")[1]);
                       tempId += 1;
                       if (tempId < 10) {
                           objectBuilder.add("id", "I00-00" + tempId);
                       } else if (tempId < 100) {
                           objectBuilder.add("id", "I00-0" + tempId);
                       } else if (tempId < 1000) {
                           objectBuilder.add("id", "I00-" + tempId);
                       }
                   }else {
                       objectBuilder.add("itemId","I00-000");

                   }
                   dataMsgBuilder.add("data", objectBuilder.build());
                   dataMsgBuilder.add("message", "Done");
                   dataMsgBuilder.add("status", 200);
                   writer.print(dataMsgBuilder.build());
                   break;
           }

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String id = req.getParameter("itemId");
        String name = req.getParameter("name");
        String qty =req.getParameter("qty");
       String price = req.getParameter("price");

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

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String itemID = req.getParameter("itemID");
        JsonObjectBuilder dataMsgBuilder = Json.createObjectBuilder();
        PrintWriter writer = resp.getWriter();

        Connection connection = null;
        try {
            connection = dataSource.getConnection();
            PreparedStatement pstm = connection.prepareStatement("DELETE FROM item WHERE itemId=?");
            pstm.setObject(1,itemID);

            if (pstm.executeUpdate() > 0) {
                resp.setStatus(HttpServletResponse.SC_OK); //200
                dataMsgBuilder.add("data", "");
                dataMsgBuilder.add("massage", "Customer Deleted");
                dataMsgBuilder.add("status", "200");
                writer.print(dataMsgBuilder.build());
            }
        } catch (SQLException e) {
            dataMsgBuilder.add("status", 400);
            dataMsgBuilder.add("message", "Error");
            dataMsgBuilder.add("data", e.getLocalizedMessage());
            writer.print(dataMsgBuilder.build());
            resp.setStatus(HttpServletResponse.SC_OK); //200
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }

        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");

        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();

        String itemIDUpdate = jsonObject.getString("itemId");
        String itemNameUpdate = jsonObject.getString("name");
        String itemQtyUpdate = jsonObject.getString("qty");
        String itemPriceUpdate = jsonObject.getString("price");
        PrintWriter writer = resp.getWriter();
        System.out.println(itemIDUpdate + " " + itemQtyUpdate + " " + itemPriceUpdate + " " + itemNameUpdate);

        Connection connection = null;
        try {
            connection = dataSource.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("UPDATE item SET name=?, qtyOnHand=?, unitPrice=? WHERE itemId=?");
            preparedStatement.setObject(1, itemNameUpdate);
            preparedStatement.setObject(2, itemQtyUpdate);
            preparedStatement.setObject(3, itemPriceUpdate);
            preparedStatement.setObject(4, itemIDUpdate);

            if (preparedStatement.executeUpdate() > 0) {
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);//201
                response.add("status", 200);
                response.add("message", "Successfully Updated");
                response.add("data", "");
                writer.print(response.build());
            }

        } catch (SQLException e) {
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status", 400);
            response.add("message", "Error");
            response.add("data", e.getLocalizedMessage());
            writer.print(response.build());
            resp.setStatus(HttpServletResponse.SC_OK); //200
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
