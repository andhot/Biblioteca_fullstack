package com.modul2AndreiBookstore.demo.entities;

public enum ReservationStatus {
    PENDING {
        @Override
        public boolean isNextStatePossible(ReservationStatus reservationStatus) {
            return reservationStatus.equals(IN_PROGRESS) || reservationStatus.equals(CANCELED)
                    || reservationStatus.equals(PENDING);
        }
    }, IN_PROGRESS {
        @Override
        public boolean isNextStatePossible(ReservationStatus reservationStatus) {
            return reservationStatus.equals(FINISHED) || reservationStatus.equals(DELAYED)
                    || reservationStatus.equals(IN_PROGRESS);
        }
    }, DELAYED {
        @Override
        public boolean isNextStatePossible(ReservationStatus reservationStatus) {
            return reservationStatus.equals(FINISHED) || reservationStatus.equals(DELAYED);
        }
    }, FINISHED {
        @Override
        public boolean isNextStatePossible(ReservationStatus reservationStatus) {
            return reservationStatus.equals(FINISHED);
        }
    }, CANCELED {
        @Override
        public boolean isNextStatePossible(ReservationStatus reservationStatus) {
            return reservationStatus.equals(CANCELED);
        }
    };

    public abstract boolean isNextStatePossible(ReservationStatus reservationStatus);
}
