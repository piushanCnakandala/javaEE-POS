package entity;

public class Orders {
    String oid;
    String date;
    String customerID;
    int discount;
    double total;
    double subTotal;

    public Orders() {
    }

    public Orders(String oid, String date, String customerID, int discount, double total, double subTotal) {
        this.oid = oid;
        this.date = date;
        this.customerID = customerID;
        this.discount = discount;
        this.total = total;
        this.subTotal = subTotal;
    }

    public String getOid() {
        return oid;
    }

    public void setOid(String oid) {
        this.oid = oid;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCustomerID() {
        return customerID;
    }

    public void setCustomerID(String customerID) {
        this.customerID = customerID;
    }

    public int getDiscount() {
        return discount;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public double getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(double subTotal) {
        this.subTotal = subTotal;
    }

    @Override
    public String toString() {
        return "Orders{" +
                "oid='" + oid + '\'' +
                ", date='" + date + '\'' +
                ", customerID='" + customerID + '\'' +
                ", discount=" + discount +
                ", total=" + total +
                ", subTotal=" + subTotal +
                '}';
    }
}
