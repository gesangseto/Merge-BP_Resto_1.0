function spfix_duplicatehost_gesang() {
  return `
    CREATE OR REPLACE FUNCTION public.spfix_duplicatehost_gesang()
    RETURNS SETOF spstatus
    LANGUAGE plpgsql
    AS $$
    DECLARE
    _retval		SPStatus%ROWTYPE;
    _spret		SPStatus%ROWTYPE;
  
    _BillNo		bill.billno%TYPE;
    _BillNo2	bill.billno%TYPE;
    _BillType	bill.billtype%TYPE;
    _HostID		bill.hostid%TYPE;
    _HostID2	bill.hostid%TYPE;
    _SaleNo		sale.saleno%TYPE;
    _countDuplicate INT;
    cBill		refcursor;
    cBillSale	refcursor;
    BEGIN
    _retval:=(0, 'OK');
    
    OPEN cBill FOR
      SELECT billno, billtype, hostid
      FROM bill
      WHERE leavetime IS NULL AND billtype='DI';
    LOOP
      FETCH cBill INTO _BillNo, _BillType, _HostID;
      EXIT WHEN NOT FOUND;
      
      SELECT INTO _countDuplicate COUNT(*) FROM bill WHERE hostid=_HostID AND leavetime IS NULL AND billtype='DI';
      
      IF _countDuplicate=1 THEN
        UPDATE host SET billno=_BillNo WHERE hostid=_HostID;
      ELSE
        /* jika lebih dari 1 maka pindah ke meja lain yg masih kosong */
        OPEN cBillSale FOR
          SELECT billno, billtype, hostid
          FROM bill WHERE hostid=_HostID AND leavetime IS NULL AND billtype='DI' AND billno!=_BillNo;				
        LOOP
          FETCH cBillSale INTO _BillNo2, _BillType, _HostID;
          EXIT WHEN NOT FOUND;
          
          SELECT INTO _HostID2 hostid FROM host WHERE hoststatuscode='KSNG' AND active = true ORDER BY hostid LIMIT 1;
        
          SELECT INTO _spret * FROM spBill_Move(_BillNo2, _HostID, _HostID2);
          IF (_spret.ErrNo<>0) THEN
            _retval.ErrNo:=_spret.ErrNo;
            _retval.ErrMsg:=_spret.ErrMsg;
            RAISE EXCEPTION '%', _retval.ErrMsg;
          END IF;
          
          SELECT INTO _spret * FROM spFix_HostStatus(_BillNo2);
          IF (_spret.ErrNo<>0) THEN
            _retval.ErrNo:=_spret.ErrNo;
            _retval.ErrMsg:=_spret.ErrMsg;
            RAISE EXCEPTION '%', _retval.ErrMsg;
          END IF;
          
        END LOOP;
        CLOSE cBillSale;
        
        SELECT INTO _spret * FROM spFix_HostStatus(_BillNo);
        IF (_spret.ErrNo<>0) THEN
          _retval.ErrNo:=_spret.ErrNo;
          _retval.ErrMsg:=_spret.ErrMsg;
          RAISE EXCEPTION '%', _retval.ErrMsg;
        END IF;
        
      END IF;
    END LOOP;
    CLOSE cBill;
  
    RETURN NEXT _retval;
    END;
    $$
    `;
}

function spbill_new_gesang() {
  return null;
}

module.exports = {
  spfix_duplicatehost_gesang,
};
