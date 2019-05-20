class Query < ActiveRecord::Base

  def statement_field(field, operator, value, db_table, db_field, is_custom_filter=false)
    sql_for_field(field, operator, value, db_table, db_field, is_custom_filter)
  end
end
