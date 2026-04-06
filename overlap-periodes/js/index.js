const overlap = (p1, p2) => {
    return !((p1.end <= p2.beg && p1.end != null && p2.beg != null) ||
             (p1.beg >= p2.end && p1.beg != null && p2.end != null))
}
