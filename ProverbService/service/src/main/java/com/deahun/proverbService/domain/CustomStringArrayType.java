package com.deahun.proverbService.domain;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.*;

public class CustomStringArrayType implements UserType<String[]> {

    public int sqlType() {
        return Types.ARRAY;
    }

    @Override
    public int getSqlType() {
        return 0;
    }

    @Override
    public Class returnedClass() {
        return String[].class;
    }

    @Override
    public boolean equals(String[] x, String[] y) {
        return false;
    }

    @Override
    public int hashCode(String[] x) {
        return 0;
    }

    @Override
    public String[] nullSafeGet(ResultSet rs, int position, SharedSessionContractImplementor session,
                                Object owner) throws SQLException {
        Array array = rs.getArray(position);
        return array != null ? (String[]) array.getArray() : null;
    }

    @Override
    public void nullSafeSet(PreparedStatement st, String[] value, int index,
                            SharedSessionContractImplementor session) throws SQLException {
        if (st != null) {
            if (value != null) {
                Array array = session.getJdbcConnectionAccess().obtainConnection()
                        .createArrayOf("text", value);
                st.setArray(index, array);
            } else {
                st.setNull(index, Types.ARRAY);
            }
        }
    }

    @Override
    public String[] deepCopy(String[] value) {
        return new String[0];
    }

    @Override
    public boolean isMutable() {
        return false;
    }

    @Override
    public Serializable disassemble(String[] value) {
        return null;
    }

    @Override
    public String[] assemble(Serializable cached, Object owner) {
        return new String[0];
    }
    //implement equals, hashCode, and other methods
}
