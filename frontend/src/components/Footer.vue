<template>
  <footer class="footer">
    <div class="wrapper">
      <div class="footer__boxes">
        <div class="footer__box">
          <h3 class="footer__box-title">
            <i class="fas fa-seedling"></i> Niech Rośnie
          </h3>
          <p>
            Twój zaufany sklep ogrodniczy z naturalnymi produktami, roślinami i ekologicznymi rozwiązaniami do Twojego domu.
          </p>
          <div class="footer__box-social">
            <a href="#" class="footer__box-link"><i class="fab fa-facebook-square"></i></a>
            <a href="#" class="footer__box-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="footer__box-link"><i class="fab fa-tiktok"></i></a>
          </div>
        </div>

        <div class="footer__box footer__box-desktop">
          <h3 class="footer__box-title">Kategorie</h3>
          <ul class="footer__box-list">
            <li class="footer__box-list-item"><a href="/shop">Wszystkie produkty</a></li>
            <li class="footer__box-list-item"><a href="/shop">Rośliny ozdobne</a></li>
            <li class="footer__box-list-item"><a href="/shop">Zestawy ogrodowe</a></li>
            <li class="footer__box-list-item"><a href="/shop">Nawozy i ziemie</a></li>
          </ul>
        </div>

        <div class="footer__box footer__box-desktop">
          <h3 class="footer__box-title">Informacje</h3>
          <ul class="footer__box-list">
            <li class="footer__box-list-item"><a href="#">O nas</a></li>
            <li class="footer__box-list-item"><a href="#">Regulamin</a></li>
            <li class="footer__box-list-item"><a href="#">Polityka prywatności</a></li>
            <li class="footer__box-list-item"><a href="#">Kontakt</a></li>
          </ul>
        </div>
      </div>
    </div>
    <hr />
    <p class="footer__bottom-text"> &copy; <span class="footer__year">{{ currentYear }}</span> Niech Rośnie – Sklep Ogrodniczy </p>
  </footer>
</template>


<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
.footer {
  background-color: #111;
  color: #eee;
  padding: 3rem 1rem 1rem;
  margin-top: 4rem;
  font-size: 0.95rem;
}

.footer__boxes {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.footer__box {
  flex: 1 1 250px;
}

.footer__box-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #00cc66;
}

.footer__box-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__box-list-item {
  margin-bottom: 0.5rem;
}

.footer__box-list-item a {
  color: #ccc;
  text-decoration: none;
}

.footer__box-list-item a:hover {
  color: #00cc66;
  text-decoration: underline;
}

.footer__box-social a {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  color: #ccc;
  transition: color 0.3s;
}

.footer__box-social a:hover {
  color: #00cc66;
}

.footer__bottom-text {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #aaa;
}

hr {
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
